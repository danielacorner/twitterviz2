import { useState } from "react";
import { AnimatingBubble } from "./AnimatingBubble";
import { Instance, Instances } from "@react-three/drei";

export function PopAnimation() {
  const numBubbles =
    Math.round(Math.random() * 7) + (Math.random() > 0.9 ? 50 : 7);
  const [bubblesIds, setBubblesIds] = useState(
    [...new Array(numBubbles)].map((_) => Math.random())
  );
  return (
    <>
      {/* Instances https://codesandbox.io/s/floating-instanced-shoes-h8o2d?file=/src/App.js */}
      <Instances
        // material={mat}
        limit={1000} // Optional: max amount of items (for calculating buffer size)
        range={1000} // Optional: draw-range
      >
        {bubblesIds.map((bubbleId) => (
          <Instance>
            <AnimatingBubble
              key={bubbleId}
              handleUnmount={() => {
                setBubblesIds((p) => p.filter((id) => id !== bubbleId));
              }}
            />
          </Instance>
        ))}
      </Instances>
    </>
  );
}
