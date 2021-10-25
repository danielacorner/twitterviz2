import { Instances } from "@react-three/drei";
import { uniqBy } from "lodash";
import { useUserNodes } from "../useUserNodes";
import {
  defaultNodeMaterial,
  nodeGeometry,
} from "./Node/materialsAndGeometries";
import { Node } from "./Node/Node";
import { useHoverAnimation } from "./useHoverAnimation";

export function Nodes() {
  const userNodes = useUserNodes();

  // const [nodesMemo, setNodesMemo] = useState(nodes);
  // useEffect(() => {
  //   const newNodes = nodes.filter(
  //     (t) =>
  //       !nodesMemo.map((nt) => nt.id_str).includes(t.id_str) ||
  //       !nodes.map((nt) => nt.id_str).includes(t.id_str)
  //   );
  //   console.log("🌟🚨 ~ useEffect ~ newNodes", newNodes);
  //   const deletedNodes = nodesMemo.filter(
  //     (t) => !nodes.map((nt) => nt.id_str).includes(t.id_str)
  //   );
  //   if (newNodes.length > 0) {
  //     setNodesMemo((prev) => [...prev, ...newNodes]);
  //   } else if (deletedNodes.length > 0) {
  //     setNodesMemo((prev) =>
  //       prev.filter(
  //         (t) => !deletedNodes.map((nt) => nt.id_str).includes(t.id_str)
  //       )
  //     );
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [nodes]);
  const hoverAnimationRefWave = useHoverAnimation({
    deltaX: 0.3,
    deltaY: 0.21,
    // randomize: true,
  });

  return (
    <mesh ref={hoverAnimationRefWave}>
      {/* Instances https://codesandbox.io/s/floating-instanced-shoes-h8o2d?file=/src/App.js */}
      <Instances
        material={defaultNodeMaterial}
        geometry={nodeGeometry}
        limit={1000} // Optional: max amount of items (for calculating buffer size)
        range={1000} // Optional: draw-range
      >
        {uniqBy(userNodes, (n) => n.id_str).map((node, idx) => {
          return <Node key={node.id_str} userNode={node} />;
        })}
      </Instances>
    </mesh>
  );
}
