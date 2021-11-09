import { useState } from "react";
import { AnimatingBubble } from "./AnimatingBubble";
import { Instance, Instances } from "@react-three/drei";

export function PopAnimation() {
  const numBubbles =
    Math.round(Math.random() * 7) + (Math.random() > 0.9 ? 50 : 7);
  console.log("🌟🚨 ~ PopAnimation ~ numBubbles", numBubbles);
  const [bubblesIds, setBubblesIds] = useState(
    [...new Array(numBubbles)].map((_) => Math.random())
  );
  return (
    <>
      <AnimatingBubble
        handleUnmount={() => {
          // setBubblesIds((p) => p.filter((id) => id !== bubbleId));
        }}
      />
    </>
  );
}
