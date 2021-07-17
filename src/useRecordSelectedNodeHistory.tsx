import { useEffect } from "react";
import { useSelectedNode } from "./providers/store/useSelectors";
import { useAtom } from "jotai";
import { selectedNodeHistoryAtom } from "providers/store/store";

export const useRecordSelectedNodeHistory = () => {
  const selectedNode = useSelectedNode();
  const [, setSelectedNodeHistory] = useAtom(selectedNodeHistoryAtom);

  // when selectedNode changes, record it
  useEffect(() => {
    setSelectedNodeHistory((p) => {
      console.log("🌟🚨 ~ useEffect ~ p", p);
      return selectedNode ? [...p, selectedNode] : p;
    });
  }, [selectedNode, setSelectedNodeHistory]);
};
