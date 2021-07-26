import { useSphere } from "@react-three/cannon";
import * as THREE from "three";
import useStore, {
	isPointerOverAtom,
	numTooltipTweetsAtom,
	rightClickMenuAtom,
	tooltipTweetIndexAtom,
} from "providers/store/store";
import { useAtom } from "jotai";
import {
	getOriginalPoster,
	useTooltipNode,
} from "providers/store/useSelectors";
import { UserNode } from "../useGraphWithUsersAndLinks";
import { useHandleOpenRightClickMenu } from "../GraphRightClickMenu";
import NodeBillboard from "./NodeBillboard";
import { useGravity } from "./useGravity";
import { useSpring, animated } from "@react-spring/three";
import { Text, Billboard } from "@react-three/drei";

const nodeMaterial = new THREE.MeshLambertMaterial({
	emissive: "blue",
	metalness: 1,
	color: "#316c83",
});
const rightClickNodeMaterial = new THREE.MeshLambertMaterial({
	emissive: "#be2626",
	metalness: -1,
	color: "#be5626",
});
const pointerOverMaterial = new THREE.MeshLambertMaterial({
	emissive: "blue",
	metalness: 1,
	color: "#3ad64f",
});
const tooltipNodeMaterial = new THREE.MeshLambertMaterial({
	emissive: "blue",
	metalness: 1,
	color: "#26be3a",
});
const RADIUS = 10;
const nodeGeometry = new THREE.SphereGeometry(RADIUS / 5, 28, 28);

export const Node = ({
	vec = new THREE.Vector3(),
	node,
	startPosition,
}: {
	vec?: any;
	node: UserNode;
	startPosition: [number, number, number];
}) => {
	const tooltipNode = useTooltipNode();
	const [rightClickMenu] = useAtom(rightClickMenuAtom);
	const isRightClickingThisNode =
		rightClickMenu.node &&
		getOriginalPoster(rightClickMenu.node)?.id_str === node.id_str;
	const isTooltipNode =
		tooltipNode && getOriginalPoster(tooltipNode)?.id_str === node.id_str;
	const setTooltipNode = useStore((state) => state.setTooltipNode);
	const setSelectedNode = useStore((state) => state.setSelectedNode);
	const [isPointerOver, setIsPointerOver] = useAtom(isPointerOverAtom);
	const [tooltipTweetIndex, setTooltipTweetIndex] = useAtom(
		tooltipTweetIndexAtom
	);
	const [, setNumTooltipTweets] = useAtom(numTooltipTweetsAtom);

	const handleRightClick = useHandleOpenRightClickMenu(node.tweets[0]);
	const onContextMenu = (event) => {
		handleRightClick(event.nativeEvent);
	};
	const onPointerEnter = () => {
		setIsPointerOver(true);
		setTooltipTweetIndex(0);
		setNumTooltipTweets(node.tweets.length);
		setTooltipNode(node.tweets[0]);
	};
	const onScroll = (event) => {
		event.stopPropagation();
		event.nativeEvent.stopPropagation();
		event.nativeEvent.preventDefault();
		const isDown = event.deltaY > 0;
		const nextTooltipTweetIdx = Math.max(
			0,
			Math.min(tooltipTweetIndex + (isDown ? 1 : -1), node.tweets.length - 1)
		);
		setTooltipTweetIndex(nextTooltipTweetIdx);
		setTooltipNode(node.tweets[nextTooltipTweetIdx]);
	};
	const onPointerLeave = () => {
		setIsPointerOver(false);
	};
	const onClick = () => {
		setSelectedNode(node.tweets[tooltipTweetIndex]);
	};

	const [ref, api] = useSphere(() => ({
		mass: 1,
		position: startPosition,
		// position: getRandomPosition(-5 * RADIUS, 5 * RADIUS),
		// type: !paused ? "Dynamic" : "Static",
		// https://threejs.org/docs/scenes/geometry-browser.html#IcosahedronBufferGeometry
		args: RADIUS,
	}));

	useGravity(api, vec);

	const springProps = useSpring({
		scale:
			isPointerOver && isTooltipNode
				? [2.2, 2.2, 2.2]
				: isTooltipNode
				? [1.8, 1.8, 1.8]
				: [1, 1, 1],
	});
	if (node.user.botScore) {
		console.log(
			"🌟🚨 ~ file: Node.tsx ~ line 138 ~ node.user.botScore",
			node.user.botScore
		);
	}

	return (
		<animated.mesh
			ref={ref}
			material={
				isRightClickingThisNode
					? rightClickNodeMaterial
					: isPointerOver && isTooltipNode
					? pointerOverMaterial
					: isTooltipNode
					? tooltipNodeMaterial
					: nodeMaterial
			}
			geometry={nodeGeometry}
			scale={springProps.scale}
			{...{
				onPointerEnter,
				onPointerLeave,
				onContextMenu,
				onWheel: onScroll,
				onClick,
			}}
		>
			{node.user.botScore ? (
				<mesh
					transparent={true}
					opacity={node.user.botScore.overall}
					scale={[
						node.user.botScore.overall,
						node.user.botScore.overall,
						node.user.botScore.overall,
					]}
				>
					<Billboard {...({} as any)}>
						<Text
							{...({} as any)}
							color="white"
							position={[0.3, 6, 0]}
							fontSize={1}
						>
							{(node.user.botScore.overall * 100).toFixed(0)}%
						</Text>
					</Billboard>
					<mesh position={[0, 2, 0]} scale={[0.7, 0.7, 0.7]}>
						<meshLambertMaterial
							metalness={0.8}
							roughness={0.1}
							color="#a3a3a3"
						/>
						<cylinderBufferGeometry args={[0.2, 0.2, 8, 26, 1]} />
					</mesh>
					<mesh position={[0, 5, 0]}>
						<meshLambertMaterial metalness={0.8} roughness={0.1} color="red" />
						<sphereBufferGeometry args={[0.5, 26, 26]} />
					</mesh>
				</mesh>
			) : null}
			<NodeBillboard
				{...{
					tweets: node.tweets,
				}}
			/>
		</animated.mesh>
	);
};

// function getRandomPosition(min, max): [x: number, y: number, z: number] {
// 	return [
// 		Math.random() * (max - min) + min,
// 		Math.random() * (max - min) + min,
// 		Math.random() * (max - min) + min,
// 	];
// }
