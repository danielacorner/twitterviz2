import { useEffect } from "react";
import "./App.css";
import styled from "styled-components/macro";
import { useLoading } from "./providers/store/useSelectors";
import { useIsLight } from "./providers/ThemeManager";
import "./video-react.css"; // import video-react css
import AppFunctionalHooks from "./AppFunctionalHooks";
import LeftDrawerCollapsible from "components/LeftDrawer";
import { RowDiv } from "components/common/styledComponents";
import { NavBar } from "components/NavBar/NavBar";
import NetworkGraph from "components/NetworkGraph/NetworkGraph";
import { useRecordSelectedNodeHistory } from "./components/useRecordSelectedNodeHistory";
import { SelectedTweetDrawer } from "./components/SelectedTweetDrawer";
import { Game } from "./components/Game/Game";
// import { useDeleteAllTweets } from "components/common/useDeleteAllTweets";
// import { useMount } from "utils/utils";

function App() {
	useRecordSelectedNodeHistory();
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
			<SelectedTweetDrawer />
			<Game />
		</AppStyles>
	);
}

export const Step2Styles = styled.div`
	position: fixed;
	inset: 80px calc(50vw - 200px);
	height: fit-content;
	color: white;
	opacity: 0.7;
	background: hsla(0, 0%, 100%, 0.05);
	border-radius: 16px;
	padding: 16px;
	h4 {
		font-size: 0.8em;
	}
`;
export const Step1Styles = styled.div`
	position: fixed;
	inset: calc(50vh - 200px) calc(50vw - 200px);
	height: fit-content;
	background: hsla(0, 0%, 0%, 0.8);
	border-radius: 16px;
	padding: 32px;
	box-shadow: 0px 2px 30px 8px hsla(0, 0%, 0%, 0.3);
	p {
		text-align: left;
		margin-bottom: 0.8em;
	}
	h3 {
		margin-bottom: 1em;
	}
	button {
		margin-top: 1em;
	}
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
		}
		(app as HTMLElement).style.background = isLight ? "white" : "hsl(0,0%,10%)";
	}, [loading, isLight]);

	return null;
}

export default App;
