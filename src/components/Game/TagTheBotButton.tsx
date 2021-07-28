import styled from "styled-components/macro";
import {
  getOriginalPoster,
  useSelectedNode,
  useSetLoading,
  useSetSelectedNode,
  useSetTooltipNode,
} from "../../providers/store/useSelectors";
import { Button, Tooltip } from "@material-ui/core";
import { useFetchBotScoreForTweet } from "components/common/useFetchBotScoreForTweet";
import { atom, useAtom } from "jotai";
import { Tweet } from "types";
// * animate a HUD-contained bot score display ?
// * animate the selected node to the front and then back?
const latestNodeWithBotScoreAtom = atom<Tweet | null>(null);

export default function TagTheBotButton() {
  const selectedNode = useSelectedNode();
  const setSelectedNode = useSetSelectedNode();
  const setTooltipNode = useSetTooltipNode();
  // const originalPoster = selectedNode && getOriginalPoster(selectedNode);
  const fetchBotScoreForTweet = useFetchBotScoreForTweet();
  const setLoading = useSetLoading();
  const [latestNodeWithBotScore, setLatestNodeWithBotScore] = useAtom(
    latestNodeWithBotScoreAtom
  );
  return selectedNode ? (
    <Tooltip title={"fetch bot score"}>
      <TagTheBotStyledButton
        variant="contained"
        color="secondary"
        onClick={() => {
          setLoading(true);
          fetchBotScoreForTweet(selectedNode).then((botScore) => {
            setLoading(false);
            if (botScore) {
              setLatestNodeWithBotScore({ ...selectedNode, botScore });
            }
          });
          setSelectedNode(null);
          setTooltipNode(null);
        }}
      >
        It's a bot! 🎯
      </TagTheBotStyledButton>
    </Tooltip>
  ) : null;
}
const WIDTH = 140;
const TagTheBotStyledButton = styled(Button)`
  &&&&&&&&& {
    width: ${WIDTH}px;
    position: fixed;
    z-index: 9999999;
    left: calc(50vw - ${WIDTH / 2}px);
    bottom: 50px;
    margin: auto;
    display: flex;
  }
`;
