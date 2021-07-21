import { useEffect } from "react";
import "./App.css";
import styled from "styled-components/macro";
import {
	getOriginalPoster,
	useLoading,
	useSelectedNode,
	useSetSelectedNode,
} from "./providers/store/useSelectors";
import { useIsLight } from "./providers/ThemeManager";
import "./video-react.css"; // import video-react css
import AppFunctionalHooks from "./AppFunctionalHooks";
import LeftDrawerCollapsible from "components/LeftDrawer";
import { RowDiv } from "components/common/styledComponents";
import { NavBar } from "components/NavBar/NavBar";
import NetworkGraph from "components/NetworkGraph/NetworkGraph";
import { useRecordSelectedNodeHistory } from "./components/useRecordSelectedNodeHistory";
import { Drawer } from "@material-ui/core";
import { SelectedTweetHistory } from "./components/SelectedTweetHistory";
import { Timeline } from "react-twitter-widgets";

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

function App() {
	useRecordSelectedNodeHistory();
	return (
		<AppStyles className="App">
			<NavBar />
			<RowDiv>
				<NetworkGraph />
			</RowDiv>
			<LeftDrawerCollapsible />
			{/* <SelectedTweetModal /> */}
			<AppStylesHooks />
			<AppFunctionalHooks />
			{/* <SelectedTweetHistory /> */}
			<SelectedTweetDrawer />
		</AppStyles>
	);
}

function SelectedTweetDrawer() {
	const selectedNode = useSelectedNode();
	const setSelectedNode = useSetSelectedNode();
	const originalPoster = selectedNode && getOriginalPoster(selectedNode);
	return (
		<Drawer
			anchor="right"
			open={Boolean(originalPoster)}
			onClose={() => setSelectedNode(null)}
		>
			{originalPoster && (
				<DrawerContentStyles>
					<Timeline
						dataSource={{
							sourceType: "profile",
							screenName: originalPoster.screen_name,
						}}
						options={{
							theme: "dark",
						}}
					/>
				</DrawerContentStyles>
			)}
		</Drawer>
	);
}
const DrawerContentStyles = styled.div``;

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
		}
		(app as HTMLElement).style.background = isLight ? "white" : "hsl(0,0%,10%)";
	}, [loading, isLight]);

	return null;
}

export default App;
