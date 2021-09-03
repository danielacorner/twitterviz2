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
import { useFetchAndReplaceNode } from "components/common/useFetchAndReplaceNode";
import { atom, useAtom } from "jotai";
import { BotScore, Tweet } from "types";
import {
  botScorePopupNodeAtom,
  isBotScoreExplainerUpAtom,
  isRightDrawerOpenAtom,
  scanningUserNodeIdAtom,
  scoreAtom,
  serverErrorAtom,
  shotsRemainingAtom,
} from "providers/store/store";
import { getScoreFromBotScore } from "./getScoreFromBotScore";
// * animate a HUD-contained bot score display ?
// * animate the selected node to the front and then back?
const latestNodeWithBotScoreAtom = atom<Tweet | null>(null);
export const BOT_SCORE_POPUP_TIMEOUT = 2000;

export default function TagTheBotButton() {
  const tweets = useTweets();
  const setTweets = useSetTweets();
  const selectedNode = useSelectedNode();
  const setSelectedNode = useSetSelectedNode();
  const fetchBotScoreForTweet = useFetchBotScoreForTweet();
  const fetchAndReplaceNode = useFetchAndReplaceNode();
  const isLoading = useLoading();
  const setLoading = useSetLoading();
  const [, setLatestNodeWithBotScore] = useAtom(latestNodeWithBotScoreAtom);
  const [shotsRemaining, setShotsRemaining] = useAtom(shotsRemainingAtom);
  const [, setScore] = useAtom(scoreAtom);
  const [, setBotScorePopupNode] = useAtom(botScorePopupNodeAtom);
  const [, setScanningUserNodeId] = useAtom(scanningUserNodeIdAtom);
  const [, setIsRightDrawerOpen] = useAtom(isRightDrawerOpenAtom);
  const [, setServerError] = useAtom(serverErrorAtom);
  const [, setIsUp] = useAtom(isBotScoreExplainerUpAtom);

  function handleReceiveBotScore(botScore: BotScore, nodeIdStr: string) {
    if (!selectedNode) {
      return;
    }
    setShotsRemaining((p) => Math.max(0, p - 1));
    setLatestNodeWithBotScore({
      ...selectedNode,
      botScore,
      user: { ...selectedNode.user, botScore },
    });
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

    // raise the info card
    setIsUp(true);

    setLoading(false);

    setScanningUserNodeId(null);

    setTweets(
      tweets.map((t) =>
        t.id_str === nodeIdStr
          ? {
              ...t,
              botScore,
              user: {
                ...selectedNode.user,
                botScore,
              },
            }
          : t
      )
    );
    // TODO: rotate the camera to face the front of the node
  }

  function setNotABot(node: Tweet) {
    setTweets((prev) =>
      prev.map((t) =>
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

  return selectedNode &&
    shotsRemaining > 0 &&
    !Boolean(selectedNode.botScore) ? (
    <BottomButtonsStyles>
      <Tooltip title={"Take your shot! Higher bot scores = more points"}>
        <Button
          // disabled={isLoading}
          variant="contained"
          color="primary"
          onClick={() => {
            const nodeIdStr = selectedNode.id_str;
            setLoading(true);
            setIsRightDrawerOpen(false);
            setScanningUserNodeId(selectedNode.user.id_str);
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
                // setTweets(
                //   tweets.map((t) =>
                //     t.id_str === selectedNode.id_str
                //       ? {
                //           ...t,
                //           botScore: newBotScore,
                //           user: {
                //             ...selectedNode.user,
                //             botScore: newBotScore,
                //           },
                //         }
                //       : t
                //   )
                // );
                handleReceiveBotScore(newBotScore, nodeIdStr);
              }, 1500);
            } else {
              fetchBotScoreForTweet(selectedNode).then((botScore) => {
                setSelectedNode(null);
                // setTooltipNode(null);
                if (botScore) {
                  handleReceiveBotScore(botScore, nodeIdStr);
                }
              });
            }
          }}
        >
          🎣 It's a bot! 🤖
        </Button>
      </Tooltip>
      <Tooltip title={"check out user stats on Botometer"}>
        <Button
          style={{ textTransform: "none" }}
          variant="contained"
          color="secondary"
          onClick={() => {
            setLoading(true);
            setNotABot(selectedNode);
            // fetch new nodes & replace on click
            fetchAndReplaceNode(selectedNode).then(
              ({ data, error, msUntilRateLimitReset }) => {
                setServerError(
                  error || msUntilRateLimitReset
                    ? {
                        ...error,
                        ...(msUntilRateLimitReset
                          ? { msUntilRateLimitReset }
                          : {}),
                      }
                    : null
                );
                setLoading(false);
                setSelectedNode(null);
              }
            );
            setIsRightDrawerOpen(false);
          }}
        >
          It's a human 👪
        </Button>
      </Tooltip>
    </BottomButtonsStyles>
  ) : null;
}

const BottomButtonsStyles = styled.div`
  position: absolute;
  z-index: 99999999999999999;
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
  button {
    font-family: "Poiret One", cursive;
    font-weight: bold;
    letter-spacing: 0.1em;
  }
`;
