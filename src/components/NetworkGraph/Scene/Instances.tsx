// https://codesandbox.io/s/react-three-fiber-react-spring-tjrmd?from-embed=&file=/src/Instances.js:0-1816

import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useImperativeHandle,
} from "react";
import { useMount } from "utils/utils";

let uuid = 0;
export let context = React.createContext({
  ref: { current: null as any },
  update: () => {
    return;
  },
  instances: { current: {} },
});
export function Instances({ children }) {
  const ref = useRef(null as any);
  const [ticker, set] = useState(0);
  const instances = useRef({});
  const api = useMemo(
    () => ({ ref, update: () => set((state) => state + 1), instances }),
    []
  );
  const count = Object.keys(instances.current).length;

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    Object.values(instances.current).forEach((matrix, index) =>
      ref.current.setMatrixAt(index, matrix)
    );
    ref.current.instanceMatrix.needsUpdate = true;
  }, [count, ticker]);

  return (
    <context.Provider value={api}>
      <instancedMesh
        key={count}
        ref={ref}
        args={[undefined, undefined, count || 1]}
      >
        {children}
      </instancedMesh>
    </context.Provider>
  );
}

export const Instance = React.forwardRef(
  ({ children, ...props }, forwardRef) => {
    const [id] = useState(() => uuid++);
    const group = useRef(null as any);
    const { ref, update, instances } = React.useContext(context);

    useMount(() => {
      group.current.updateMatrixWorld();
      instances.current[id] = group.current.matrixWorld;
      update();
      return () => {
        delete instances.current[id];
      };
    });

    useImperativeHandle(forwardRef, () => ({
      position: group.current.position,
      scale: group.current.scale,
      rotation: group.current.rotation,
      update: () => {
        // todo: optimize into a static object lookup
        Object.keys(instances.current).forEach((key, index) => {
          if (String(key) === String(id)) {
            group.current.updateMatrixWorld();
            ref.current.setMatrixAt(index, group.current.matrixWorld);
          }
        });
        ref.current.instanceMatrix.needsUpdate = true;
      },
    }));

    return (
      <group ref={group} {...props}>
        {children}
      </group>
    );
  }
);
