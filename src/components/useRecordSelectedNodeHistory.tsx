import { useEffect } from "react";
import { useSelectedNode } from "../providers/store/useSelectors";
import { useAtom } from "jotai";
import { selectedNodeHistoryAtom } from "providers/store/store";
import { uniqBy } from "lodash";

export const useRecordSelectedNodeHistory = () => {
	const selectedNode = useSelectedNode();
	const [, setSelectedNodeHistory] = useAtom(selectedNodeHistoryAtom);

	// when selectedNode changes, record it
	useEffect(() => {
		setSelectedNodeHistory((p) => {
			return selectedNode ? uniqBy([...p, selectedNode], (t) => t.id_str) : p;
		});
	}, [selectedNode, setSelectedNodeHistory]);
};
