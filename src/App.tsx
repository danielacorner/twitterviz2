import { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components/macro";
import { useLoading } from "./providers/store/useSelectors";
import { useIsLight } from "./providers/ThemeManager";
import "./video-react.css"; // import video-react css
import AppFunctionalHooks from "./AppFunctionalHooks";
import LeftDrawerCollapsible from "components/LeftDrawer";
import { RowDiv } from "components/common/styledComponents";
// import { NavBar } from "components/NavBar/NavBar";
import NetworkGraph from "components/NetworkGraph/NetworkGraph";
import { RightDrawer } from "./components/RightDrawer/RightDrawer";
import { Game } from "./components/Game/Game";
import { Canvas } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { useMount } from "utils/utils";
// import { useDeleteAllTweets } from "components/common/useDeleteAllTweets";
// import { useMount } from "utils/utils";

function App() {
	// useRecordSelectedNodeHistory();
	return (
		<AppStyles className="App">
			{/* {process.env.NODE_ENV !== "production" && <NavBar />} */}
			<RowDiv>
				<NetworkGraph />
			</RowDiv>
			{process.env.NODE_ENV !== "production" && <LeftDrawerCollapsible />}
			{/* <SelectedTweetModal /> */}
			<AppStylesHooks />
			<AppFunctionalHooks />
			{/* <SelectedTweetHistory /> */}
			<RightDrawer />
			<Game />
			<LoadingIndicator />
		</AppStyles>
	);
}

function LoadingIndicator() {
	const isLoading = useLoading();

	const springProps = useSpring({
		opacity: isLoading ? 1 : 0,
		position: isLoading ? [0, 0, 0] : [0, -5, 0],
	});

	const [toggle, setToggle] = useState(true);
	const initial = (Math.PI / 180) * 30;
	const springSpin = useSpring({
		rotation: toggle
			? [initial, 0, 0]
			: [Math.PI * 2 + initial, 0, Math.PI * 2],
		delay: 500,
		onRest: () => {
			setToggle(!toggle);
		},
		config: { tension: 300, mass: 30, friction: 170 },
	});
	useMount(() => {
		setToggle(!toggle);
	});

	return (
		<LoadingIndicatorStyles>
			<Canvas style={{ width: "100%", height: 180 }}>
				<animated.mesh {...springProps} rotation={springSpin.rotation}>
					<icosahedronBufferGeometry args={[1, 0]} />
					<meshBasicMaterial wireframe={true} />
				</animated.mesh>
			</Canvas>
		</LoadingIndicatorStyles>
	);
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
const AppStyles = styled.div`
	transition: background 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
	min-height: 100vh;

	* {
		margin: 0;
		box-sizing: border-box;
	}
	a {
		color: cornflowerblue;
		&:visited {
			color: hsl(250, 50%, 60%);
		}
	}
`;

function AppStylesHooks() {
	const loading = useLoading();
	const isLight = useIsLight();

	useEffect(() => {
		const app = document.querySelector(".App");
		if (!app) {
			return;
		}
		if (loading) {
			(app as HTMLElement).style.cursor = "wait";
		} else {
			(app as HTMLElement).style.cursor = "unset";
		}
		(app as HTMLElement).style.background = isLight ? "white" : "hsl(0,0%,10%)";
	}, [loading, isLight]);

	return null;
}

export default App;
