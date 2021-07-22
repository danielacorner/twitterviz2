import { useSphere } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import useStore, {
	isPointerOverAtom,
	numTooltipTweetsAtom,
	rightClickMenuAtom,
	tooltipTweetIndexAtom,
} from "providers/store/store";
import { useFrame } from "@react-three/fiber";
import { getRandomPosition } from "./Scene";
import { useAtom } from "jotai";
import { useTooltipNode } from "providers/store/useSelectors";
import { UserNode } from "../useGraphWithUsersAndLinks";
import { useConfig } from "providers/store/useConfig";
import { useHandleOpenRightClickMenu } from "../GraphRightClickMenu";
import NodeBillboard from "./NodeBillboard";

const nodeMaterial = new THREE.MeshLambertMaterial({
	emissive: "blue",
	metalness: 1,
	color: "#316c83",
});
const rightClickNodeMaterial = new THREE.MeshLambertMaterial({
	emissive: "orange",
	metalness: 1,
	color: "#be9729",
});
const tooltipNodeMaterial = new THREE.MeshLambertMaterial({
	emissive: "yellow",
	metalness: 1,
	color: "#ecf021",
});
const RADIUS = 10;
const nodeGeometry = new THREE.SphereGeometry(RADIUS / 5, 28, 28);

export const Node = ({
	vec = new THREE.Vector3(),
	node,
}: {
	vec?: any;
	node: UserNode;
}) => {
	const tooltipNode = useTooltipNode();
	const [rightClickMenu] = useAtom(rightClickMenuAtom);
	const isRightClickingThisNode = rightClickMenu.node?.id_str === node.id_str;
	const isTooltipNode = tooltipNode?.user.id_str === node.id_str;
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
		position: getRandomPosition(-5 * RADIUS, 5 * RADIUS),
		// type: !paused ? "Dynamic" : "Static",
		// https://threejs.org/docs/scenes/geometry-browser.html#IcosahedronBufferGeometry
		args: RADIUS,
	}));

	// apply force toward center
	// copied from https://codesandbox.io/s/zxpv7?file=/src/App.js:1195-1404
	const position = useRef([0, 0, 0]);
	const { isPaused } = useConfig();
	useEffect(() => api.position.subscribe((v) => (position.current = v)), [api]);
	useFrame(() => {
		if (isPaused) {
			api.velocity.set(0, 0, 0);
		} else {
			api.applyForce(
				vec
					.set(...position.current)
					.normalize()
					.multiplyScalar(-3)
					.toArray(),
				[0, 0, 0]
			);
		}
	});

	return (
		<mesh
			ref={ref}
			material={
				isRightClickingThisNode
					? rightClickNodeMaterial
					: isTooltipNode
					? tooltipNodeMaterial
					: nodeMaterial
			}
			geometry={nodeGeometry}
			scale={isTooltipNode ? [2, 2, 2] : [1, 1, 1]}
			{...{
				onPointerEnter,
				onPointerLeave,
				onContextMenu,
				onWheel: onScroll,
				onClick,
			}}
		>
			<NodeBillboard
				{...{
					tweets: node.tweets,
				}}
			/>
		</mesh>
	);
};
