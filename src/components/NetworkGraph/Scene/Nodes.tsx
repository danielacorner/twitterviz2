import { useUserNodes } from "../useUserNodes";
import { Node } from "./Node/Node";
import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useHoverAnimation } from "./useHoverAnimation";

export function Nodes() {
  const nodes = useUserNodes();
  const { viewport } = useThree();

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
      {nodes.map((node, idx) => {
        return <Node key={node.id_str} node={node} />;
      })}
    </mesh>
  );
}
