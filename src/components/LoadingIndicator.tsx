import { useEffect, useRef, useState } from "react";
import styled from "styled-components/macro";
import { useLoading } from "../providers/store/useSelectors";
import { Canvas } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { useMount } from "utils/utils";
import { LinearProgress } from "@material-ui/core";
import { WAIT_FOR_STREAM_TIMEOUT } from "utils/constants";
import { useInterval } from "utils/useInterval";
import { Loader } from "@react-three/drei";

export function LoadingIndicator() {
	return (
		<>
			<LinearProgressIndicator />
			<LoadingSpinner3D />
			<Loader />
		</>
	);
}
function LoadingSpinner3D() {
	const isLoading = useLoading();

	const springProps = useSpring({
		opacity: isLoading ? 1 : 0,
		position: isLoading ? [0, 0, 0] : [0, -5, 0],
	});

	const [[x2, y2, z2], setPos2] = useState([
		Math.random(),
		Math.random(),
		Math.random(),
	]);
	const [step, setStep] = useState(0);
	useMount(() => {
		setTimeout(() => {
			setStep(1);
		}, 500);
	});
	const ref = useRef(null as any);
	const [color, setColor] = useState(`hsl(0,0%,0%)`);
	const initial = (Math.PI / 180) * 30;
	const springSpin = useSpring({
		rotation:
			step === 0
				? [initial, 0, 0]
				: step === 1
				? [2 * Math.PI * x2 + initial, 2 * Math.PI * y2, 2 * Math.PI * z2]
				: step === 2
				? [2 * Math.PI * x2 + initial, 2 * Math.PI * y2, 2 * Math.PI * z2]
				: step === 3
				? [2 * Math.PI * x2 + initial, 2 * Math.PI * y2, 2 * Math.PI * z2]
				: [2 * Math.PI * x2 + initial, 2 * Math.PI * y2, 2 * Math.PI * z2],
		color,
		delay: 500,
		onRest: () => {
			setPos2([Math.random(), Math.random(), Math.random()]);
			const isLastStep = step === 3;
			setStep(isLastStep ? 0 : step + 1);
		},

		config: { tension: 300, mass: 30, friction: 170 },
	});
	// const { color } = useControls({ color: "#5a8694" });

	// change the colour every so often
	const [intervalMs, setIntervalMs] = useState(2500);
	useInterval({
		callback: () => {
			const hue = Math.floor(Math.random() * 360);
			setColor(`hsl(${hue},100%,60%)`);
		},
		delay: intervalMs,
		immediate: false,
	});
	// change the interval each time
	useEffect(() => {
		setIntervalMs(Math.random() * 8000 + 1000);
	}, [isLoading]);

	return (
		<LoadingIndicatorStyles>
			<Canvas style={{ width: "100%", height: 180 }}>
				<animated.mesh
					ref={ref}
					{...(springProps as any)}
					rotation={springSpin.rotation as any}
				>
					<icosahedronBufferGeometry args={[1, 0]} />
					<animated.meshBasicMaterial
						wireframe={true}
						color={springSpin.color}
					/>
				</animated.mesh>
			</Canvas>
		</LoadingIndicatorStyles>
	);
}

function LinearProgressIndicator() {
	const isLoading = useLoading();

	const [progress, setProgress] = useState(0);
	useMount(() => {
		// increment progress every second
		const timer = setInterval(() => {
			const progressPerSecond = 100 / (WAIT_FOR_STREAM_TIMEOUT / 1000);
			setProgress((p) => {
				const newProgress = p + progressPerSecond;
				if (newProgress >= 100) {
					clearInterval(timer);
				}
				return newProgress;
			});
		}, 1000);
	});
	// when we stop loading, reset progress
	useEffect(() => {
		if (!isLoading) {
			setProgress(0);
		}
	}, [isLoading]);

	return isLoading && progress < 100 ? (
		<LinearProgress
			color={"secondary"}
			variant="determinate"
			value={progress}
		/>
	) : null;
}
const LoadingIndicatorStyles = styled.div`
	z-index: 999999999;
	pointer-events: none;
	position: fixed;
	height: 128px;
	bottom: 0;
	left: 0;
	right: 0;
`;
