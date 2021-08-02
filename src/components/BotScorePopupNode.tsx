import { useEffect, useMemo, useRef } from "react";
import {
  useLoading,
  useSelectedNode,
  useTweets,
} from "../providers/store/useSelectors";
import { animated, useSpring } from "@react-spring/three";
import { NodeContent } from "components/NetworkGraph/Scene/Node";
import { Canvas } from "@react-three/fiber";
import { UserNode } from "components/NetworkGraph/useGraphWithUsersAndLinks";

/** pops up and animates when you get a new bot score */
export function BotScorePopupNode() {
  const isLoading = useLoading();
  const springProps = useSpring({
    opacity: isLoading ? 1 : 0,
    scale: isLoading ? 1 : 0.1,
  });
  const selectedNode = useSelectedNode();
  const tweets = useTweets();

  const selectedUserNode = useMemo(() => {
    const tweetsByUser = selectedNode
      ? tweets.filter((t) => t.user.id_str === selectedNode.user.id_str)
      : [];
    return selectedNode
      ? {
          tweets: tweetsByUser,
          user: selectedNode.user,
          id_str: selectedNode.user.id_str,
        }
      : null;
  }, [tweets, selectedNode]);

  const lastSelectedNode = useRef<UserNode | null>(null);

  useEffect(() => {
    if (selectedUserNode) {
      lastSelectedNode.current = selectedUserNode;
    }
  }, [selectedUserNode, tweets]);

  const node = selectedUserNode || lastSelectedNode.current;
  console.log("🌟🚨 ~ BotScorePopupNode ~ node", node);
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: 200,
        height: 200,
        bottom: 0,
        zIndex: 99999999999,
        pointerEvents: "none",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Canvas style={{ width: 200, height: 200 }}>
        <animated.mesh
          transparent={true}
          opacity={springProps.opacity}
          scale={springProps.scale}
        >
          {node ? <NodeContent {...{ node }} /> : null}
        </animated.mesh>
      </Canvas>
    </div>
  );
}
