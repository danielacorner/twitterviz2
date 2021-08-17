import { useAtom } from "jotai";
import { botScorePopupNodeAtom } from "providers/store/store";
import { useEffect, useState } from "react";
import { UserNode } from "../../useUserNodes";

export function useLatestTaggedNode() {
  const [node] = useAtom(botScorePopupNodeAtom);
  const [lastNode, setLastNode] = useState<UserNode | null>(null);
  // const lastNode = useRef<UserNode | null>(null);
  useEffect(() => {
    if (node) {
      setLastNode(node);
    }
  }, [node]);
  const nodeDisplay = node || lastNode; // ?
  const latestBotScore = nodeDisplay?.user.botScore;
  return {
    latestBotScore,
    node,
    nodeDisplay,
  };
}
