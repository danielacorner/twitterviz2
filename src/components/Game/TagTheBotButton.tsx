import styled from "styled-components/macro";
import {
  useSelectedNode,
  useSetLoading,
  useSetSelectedNode,
  useSetTooltipNode,
} from "../../providers/store/useSelectors";
import { Button, Tooltip } from "@material-ui/core";
import { useFetchBotScoreForTweet } from "components/common/useFetchBotScoreForTweet";
import { atom, useAtom } from "jotai";
import { Tweet } from "types";
import { OpenInNew } from "@material-ui/icons";
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
  const [, setLatestNodeWithBotScore] = useAtom(latestNodeWithBotScoreAtom);
  return selectedNode ? (
    <BottomButtonsStyles>
      <Tooltip title={"fetch user bot score!"}>
        <Button
          variant="contained"
          color="primary"
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
        </Button>
      </Tooltip>
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
            🔍 Investigate... <OpenInNew style={{ transform: "scale(0.8)" }} />
          </Button>
        </a>
      </Tooltip>
    </BottomButtonsStyles>
  ) : null;
}

const BottomButtonsStyles = styled.div`
  position: fixed;
  z-index: 9999999;
  left: 0;
  right: 0;
  bottom: 50px;
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
