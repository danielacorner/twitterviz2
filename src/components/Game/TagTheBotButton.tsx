import styled from "styled-components/macro";
import {
	getOriginalPoster,
	useSelectedNode,
} from "../../providers/store/useSelectors";
import { Button, Tooltip } from "@material-ui/core";
import { useFetchBotScoreForTweet } from "components/common/useFetchBotScoreForTweet";

export default function TagTheBotButton() {
	const selectedNode = useSelectedNode();
	// const originalPoster = selectedNode && getOriginalPoster(selectedNode);
	const fetchBotScoreForTweet = useFetchBotScoreForTweet();
	return selectedNode ? (
		<Tooltip
			title={
				<div style={{ fontSize: 14 }}>
					<div style={{ marginBottom: 2, textAlign: "center" }}>
						fetch bot score!
					</div>
					<div>(only one shot per game)</div>
				</div>
			}
		>
			<TagTheBotStyledButton
				variant="contained"
				color="secondary"
				onClick={() => {
					fetchBotScoreForTweet(selectedNode);
				}}
			>
				It's a bot! 🎯
			</TagTheBotStyledButton>
		</Tooltip>
	) : null;
}
const WIDTH = 115;
const TagTheBotStyledButton = styled(Button)`
	&&&&&&&&& {
		width: ${WIDTH}px;
		position: fixed;
		z-index: 9999999;
		left: calc(50vw - ${WIDTH / 2}px);
		bottom: 50px;
		margin: auto;
		text-transform: none;
	}
`;
