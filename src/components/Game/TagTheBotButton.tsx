import styled from "styled-components/macro";
import {
	useLoading,
	useSelectedNode,
	useSetLoading,
	useSetSelectedNode,
} from "../../providers/store/useSelectors";
import { Button, Tooltip } from "@material-ui/core";
import { useFetchBotScoreForTweet } from "components/common/useFetchBotScoreForTweet";
import { atom, useAtom } from "jotai";
import { Tweet } from "types";
import {
	botScorePopupNodeAtom,
	scoreAtom,
	shotsRemainingAtom,
} from "providers/store/store";
import { getScoreFromBotScore } from "./getScoreFromBotScore";
// * animate a HUD-contained bot score display ?
// * animate the selected node to the front and then back?
const latestNodeWithBotScoreAtom = atom<Tweet | null>(null);
const BOT_SCORE_POPUP_TIMEOUT = 3500;

export default function TagTheBotButton() {
	const selectedNode = useSelectedNode();
	const setSelectedNode = useSetSelectedNode();
	// const originalPoster = selectedNode && getOriginalPoster(selectedNode);
	const fetchBotScoreForTweet = useFetchBotScoreForTweet();
	const isLoading = useLoading();
	const setLoading = useSetLoading();
	const [, setLatestNodeWithBotScore] = useAtom(latestNodeWithBotScoreAtom);
	const [shotsRemaining, setShotsRemaining] = useAtom(shotsRemainingAtom);
	const [, setScore] = useAtom(scoreAtom);
	const [, setBotScorePopupNode] = useAtom(botScorePopupNodeAtom);

	return selectedNode && shotsRemaining > 0 ? (
		<BottomButtonsStyles>
			{Boolean(selectedNode.botScore) ? null : (
				<Tooltip title={"Take your shot! Higher bot scores = more points"}>
					<Button
						disabled={isLoading}
						variant="contained"
						color="primary"
						onClick={() => {
							setLoading(true);
							setBotScorePopupNode({
								user: selectedNode.user,
								tweets: [selectedNode],
								id_str: selectedNode.user.id_str,
							});
							fetchBotScoreForTweet(selectedNode).then((botScore) => {
								setSelectedNode(null);
								// setTooltipNode(null);
								setShotsRemaining((p) => Math.max(0, p - 1));
								if (botScore) {
									setLatestNodeWithBotScore({ ...selectedNode, botScore });
									setScore(
										(p) => p + getScoreFromBotScore(botScore).scoreIncrease
									);
									// show and then hide the bot score popup
									setBotScorePopupNode({
										user: { ...selectedNode.user, botScore },
										tweets: [{ ...selectedNode, botScore }],
										id_str: selectedNode.user.id_str,
									});
									setTimeout(() => {
										setBotScorePopupNode(null);
									}, BOT_SCORE_POPUP_TIMEOUT);
								}
								setLoading(false);
							});
						}}
					>
						It's a bot! 🎯
					</Button>
				</Tooltip>
			)}
			<Tooltip title={"check out user stats on Botometer"}>
				<a
					href={`https://botometer.osome.iu.edu/userDetail/${selectedNode.user.screen_name}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button
						style={{ textTransform: "none" }}
						variant="contained"
						color="secondary"
					>
						View User Data 📊
					</Button>
				</a>
			</Tooltip>
		</BottomButtonsStyles>
	) : null;
}

const BottomButtonsStyles = styled.div`
	position: absolute;
	bottom: 48px;
	left: 0;
	right: 0;
	margin: auto;
	display: flex;
	justify-content: center;
	gap: 12px;
	pointer-events: none;
	a,
	button {
		pointer-events: auto;
	}
	a {
		text-decoration: none;
	}
`;
