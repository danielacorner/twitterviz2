import { animated, useSpring } from "@react-spring/three";
import { NodeContent } from "components/NetworkGraph/Scene/Node/Node";
import { Canvas, useFrame } from "@react-three/fiber";
import styled from "styled-components/macro";
import { useAtom } from "jotai";
import { botScorePopupNodeAtom } from "providers/store/store";
import { useEffect, useRef, useState } from "react";
import { UserNode } from "./NetworkGraph/useGraphWithUsersAndLinks";

/** pops up and animates when you get a new bot score */
export function BotScorePopupNode() {
	const [node] = useAtom(botScorePopupNodeAtom);
	const [lastNode, setLastNode] = useState<UserNode | null>(null);
	// const lastNode = useRef<UserNode | null>(null);
	useEffect(() => {
		if (node) {
			setLastNode(node);
		}
	}, [node]);
	const nodeDisplay = node || lastNode;
	const springProps = useSpring({
		scale: node
			? nodeDisplay?.user.botScore
				? [0.5, 0.5, 0.5]
				: [0.9, 0.9, 0.9]
			: [0, 0, 0],
	});
	return (
		<PopupStyles>
			<ContentStyles>
				<Canvas style={{ width: 300, height: 600, zIndex: 999999999999999 }}>
					<animated.mesh scale={springProps.scale} position={[0, 0, -2]}>
						{nodeDisplay ? (
							<>
								<NodeContent
									{...{
										node: nodeDisplay,
										isTooltipNode: false,
										isPointerOver: false,
										isRightClickingThisNode: false,
										forceOpaque: true,
									}}
								/>
								<ambientLight intensity={4} />
								<directionalLight position={[0, 5, -4]} intensity={6} />
								{nodeDisplay.user.botScore ? null : <ScanningAnimation />}
							</>
						) : null}
					</animated.mesh>
				</Canvas>
			</ContentStyles>
		</PopupStyles>
	);
}
const WIDTH = 4;
function ScanningAnimation() {
	const ref = useRef<any>(null);
	const ref2 = useRef<any>(null);

	useFrame(({ clock }) => {
		const seconds = clock.getElapsedTime();
		if (ref.current && ref2.current) {
			const progress = seconds % (Math.PI * 2);
			const y = Math.sin(progress) * WIDTH * 0.5;
			ref.current.position.set(0, y, 0);

			ref2.current.rotation.y += 0.01;
			ref2.current.rotation.z += 0.01;
		}
	});
	return (
		<mesh>
			<mesh ref={ref}>
				<boxBufferGeometry args={[WIDTH, 0.02 * WIDTH, WIDTH]} />
				<meshBasicMaterial color={"#3ac7ff"} transparent={true} opacity={0.5} />
			</mesh>
			<mesh ref={ref2}>
				<icosahedronBufferGeometry args={[2.5, 1]} />
				<meshBasicMaterial
					wireframe={true}
					transparent={true}
					opacity={0.15}
					color={"#3ac7ff"}
				/>
			</mesh>
		</mesh>
	);
}

const ContentStyles = styled.div`
	position: fixed;
	inset: 0;
	display: grid;
	place-items: center;
	z-index: 9999999999999999999;
`;
const PopupStyles = styled.div`
	pointer-events: none;
`;
