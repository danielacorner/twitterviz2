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
import { useRecordSelectedNodeHistory } from "./useRecordSelectedNodeHistory";
import { useAtom } from "jotai";
import { selectedNodeHistoryAtom } from "providers/store/store";
import { Tweet as TweetWidget } from "react-twitter-widgets";
import { Drawer } from "@material-ui/core";

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
			<SelectedTweetHistory />
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
			open={Boolean(selectedNode)}
			onClose={() => setSelectedNode(null)}
		>
			{originalPoster && (
				<DrawerContentStyles>
					<iframe
						title={`Twitter - ${originalPoster.screen_name}`}
						src={`https://twitter.com/${originalPoster.screen_name}`}
					/>
				</DrawerContentStyles>
			)}
		</Drawer>
	);
}
const DrawerContentStyles = styled.div``;

function SelectedTweetHistory() {
	const [selectedNodeHistory] = useAtom(selectedNodeHistoryAtom);
	return (
		<SelectedTweetHistoryStyles>
			{selectedNodeHistory.map((node) => (
				<TweetWidget
					tweetId={node.id_str}
					options={{ dnt: true, theme: "dark" }}
				/>
			))}
		</SelectedTweetHistoryStyles>
	);
}
const SelectedTweetHistoryStyles = styled.div`
	position: fixed;
	bottom: 0;
	right: 0;
	display: flex;
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
		}
		(app as HTMLElement).style.background = isLight ? "white" : "hsl(0,0%,10%)";
	}, [loading, isLight]);

	return null;
}

export default App;
