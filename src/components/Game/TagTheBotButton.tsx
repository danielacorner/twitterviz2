import styled from "styled-components/macro";
import {
  useLoading,
  useSelectedNode,
  useSetLoading,
  useSetSelectedNode,
  useSetTweets,
  useTweets,
} from "../../providers/store/useSelectors";
import { Button, Tooltip } from "@material-ui/core";
import { useFetchBotScoreForTweet } from "components/common/useFetchBotScoreForTweet";
import { atom, useAtom } from "jotai";
import { BotScore, Tweet } from "types";
import {
  botScorePopupNodeAtom,
  isRightDrawerOpenAtom,
  scanningNodeIdAtom,
  scoreAtom,
  shotsRemainingAtom,
} from "providers/store/store";
import { getScoreFromBotScore } from "./getScoreFromBotScore";
// * animate a HUD-contained bot score display ?
// * animate the selected node to the front and then back?
const latestNodeWithBotScoreAtom = atom<Tweet | null>(null);
export const BOT_SCORE_POPUP_TIMEOUT = 2500;

export default function TagTheBotButton() {
  const tweets = useTweets();
  const setTweets = useSetTweets();
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

  function handleReceiveBotScore(botScore: BotScore) {
    if (!selectedNode) {
      return;
    }
    setShotsRemaining((p) => Math.max(0, p - 1));
    setLatestNodeWithBotScore({ ...selectedNode, botScore });
    setScore((p) => p + getScoreFromBotScore(botScore).scoreIncrease);
    // show and then hide the bot score popup
    setBotScorePopupNode({
      user: { ...selectedNode.user, botScore },
      tweets: [{ ...selectedNode, botScore }],
      id_str: selectedNode.user.id_str,
    });
    setTimeout(() => {
      setBotScorePopupNode(null);
    }, BOT_SCORE_POPUP_TIMEOUT);

    setLoading(false);
    setScanningNodeId(null);
  }

  function setNotABot(node: Tweet) {
    setTweets(
      tweets.map((t) =>
        t.id_str === node.id_str
          ? {
              ...node,
              isNotABot: true,
              user: { ...node.user, isNotABot: true },
            }
          : t
      )
    );
  }
  const [scanningNodeId, setScanningNodeId] = useAtom(scanningNodeIdAtom);
  const [, setIsRightDrawerOpen] = useAtom(isRightDrawerOpenAtom);

  return selectedNode &&
    shotsRemaining > 0 &&
    !Boolean(selectedNode.botScore) ? (
    <BottomButtonsStyles>
      <Tooltip title={"Take your shot! Higher bot scores = more points"}>
        <Button
          disabled={isLoading}
          variant="contained"
          color="primary"
          onClick={() => {
            setLoading(true);
            setIsRightDrawerOpen(false);
            setScanningNodeId(selectedNode.user.id_str);
            setBotScorePopupNode({
              user: selectedNode.user,
              tweets: [selectedNode],
              id_str: selectedNode.user.id_str,
            });
            const hiddenBotScore = selectedNode.hiddenBotScore;
            if (hiddenBotScore) {
              const newBotScore = { ...hiddenBotScore };
              setSelectedNode(null);
              setTimeout(() => {
                setTweets(
                  tweets.map((t) =>
                    t.id_str === selectedNode.id_str
                      ? {
                          ...t,
                          botScore: newBotScore,
                          user: {
                            ...selectedNode.user,
                            botScore: newBotScore,
                          },
                        }
                      : t
                  )
                );
                handleReceiveBotScore(newBotScore);
              }, 1500);
            } else {
              fetchBotScoreForTweet(selectedNode).then((botScore) => {
                setSelectedNode(null);
                // setTooltipNode(null);
                if (botScore) {
                  handleReceiveBotScore(botScore);
                }
              });
            }
          }}
        >
          It's a bot! 🎯
        </Button>
      </Tooltip>
      <Tooltip title={"check out user stats on Botometer"}>
        <Button
          style={{ textTransform: "none" }}
          variant="contained"
          color="secondary"
          onClick={() => {
            setNotABot(selectedNode);
            setSelectedNode(null);
          }}
        >
          Not a bot...
        </Button>
      </Tooltip>
    </BottomButtonsStyles>
  ) : null;
}

const BottomButtonsStyles = styled.div`
  position: absolute;
  bottom: 64px;
  @media (min-width: 768px) {
    bottom: 32px;
  }
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
