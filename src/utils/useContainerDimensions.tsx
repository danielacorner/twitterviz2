import { useState, useCallback, useEffect, useRef } from "react";
import { useMount } from "./utils";

export interface DimensionObject {
  width: number;
  height: number;
  top: number;
  left: number;
  x: number;
  y: number;
  right: number;
  bottom: number;
}

type UseDimensionsHook = [
  (instance: HTMLElement | null) => void,
  DimensionObject,
  HTMLElement | null
];

interface UseDimensionsArgs {
  liveMeasure?: boolean;
  listenToScroll?: boolean;
  listenToResize?: boolean;
}
function getDimensionObject(node: HTMLElement): DimensionObject {
  const rect = node.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    top: "x" in rect ? rect.x : (rect as any).top,
    left: "y" in rect ? rect.y : (rect as any).left,
    x: "x" in rect ? rect.x : (rect as any).left,
    y: "y" in rect ? rect.y : (rect as any).top,
    right: rect.right,
    bottom: rect.bottom,
  };
}

/* modified from https://github.com/Swizec/useDimensions to use parent node instead */
const useContainerDimensions = ({
  liveMeasure = true,
  listenToScroll = false,
  listenToResize = true,
}: UseDimensionsArgs = {}): UseDimensionsHook => {
  const [dimensions, setDimensions] = useState({} as DimensionObject);
  const [node, setNode] = useState(null as HTMLElement | null);

  const getIsMounted = useGetIsMounted();

  const ref = useCallback((_node) => {
    setNode(_node);
  }, []);

  useMount(() => () => {
    setNode(null);
  });

  useEffect(() => {
    if (node?.parentElement) {
      const measure = () =>
        // setTimeout here to put it at the end of the call stack, after all layouts have updated
        // (otherwise zooming in/out causes update too early)
        setTimeout(() =>
          window.requestAnimationFrame(() => {
            if (node?.parentElement && getIsMounted()) {
              setDimensions(getDimensionObject(node.parentElement));
            }
          })
        );
      measure();

      if (liveMeasure) {
        if (listenToResize) {
          window.addEventListener("resize", measure);
        }
        if (listenToScroll) {
          window.addEventListener("scroll", measure);
        }

        return () => {
          if (listenToResize) {
            window.removeEventListener("resize", measure);
          }
          if (listenToScroll) {
            window.removeEventListener("scroll", measure);
          }
        };
      }
    }
    return () => null;
  }, [node, listenToResize, listenToScroll, liveMeasure, getIsMounted]);

  return [ref, dimensions, node];
};

export default useContainerDimensions;

function useGetIsMounted(): () => boolean {
  const mountedRef = useRef<boolean>(true);

  // useMount is a useEffect with no dependencies, so it only runs once, on mount
  useMount(() => {
    return () => {
      // The cleanup function of useEffect is called by React on unmount
      mountedRef.current = false;
    };
  });

  // we return a useCallback (a memoized function) to avoid
  // causing re-renders when the mountedRef.current changes
  return useCallback(() => mountedRef.current, []);
}
