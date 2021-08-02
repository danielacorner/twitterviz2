import NodeTooltip from "./NodeTooltip";
// https://www.npmjs.com/package/react-force-graph
import styled from "styled-components/macro";
// https://www.npmjs.com/package/d3-force-cluster
import GraphRightClickMenu, {
	useHandleOpenRightClickMenu,
} from "./GraphRightClickMenu";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene/Scene";
import { useSetTooltipNode } from "providers/store/useSelectors";
import { CAMERA_POSITION } from "utils/constants";
import { getIsTouchDevice } from "./getIsTouchDevice";

export const GraphStyles = styled.div`
	width: 100%;
`;

const NetworkGraph = () => {
	const isTouchDevice = getIsTouchDevice();

	return (
		<GraphStyles>
			<Graph3D />
			{!isTouchDevice && <NodeTooltip />}
			{process.env.NODE_ENV !== "production" && <GraphRightClickMenu />}
		</GraphStyles>
	);
};

// {...({} as any)} = typescript is busted ?

function Graph3D() {
	const setTooltipNode = useSetTooltipNode();
	const handleRightClick = useHandleOpenRightClickMenu(null);

	return (
		<Graph3DStyles>
			<Canvas
				style={{ background: "none" }}
				gl={{ alpha: true, stencil: false, depth: true, antialias: false }}
				camera={{
					position: CAMERA_POSITION.initial,
					fov: 35,
					near: 10,
					far: 500,
				}}
				onPointerMissed={(event) => {
					if (event.type === "contextmenu") {
						handleRightClick(event);
					}
					setTooltipNode(null);
				}}
			>
				<Scene />
			</Canvas>
		</Graph3DStyles>
	);
}

const Graph3DStyles = styled.div`
	position: fixed;
	inset: 0px;
`;

export default NetworkGraph;
