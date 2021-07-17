import { ClickAwayListener, Modal } from "@material-ui/core";
import { TOOLTIP_WIDTH } from "components/NetworkGraph/NodeTooltip";
import useStore from "providers/store/store";
import { useSelectedNode } from "providers/store/useSelectors";
import styled from "styled-components/macro";
import { Tweet } from "react-twitter-widgets";
import { CUSTOM_SHRINKING_SCROLLBAR_CSS } from "components/common/styledComponents";
import { LEFT_DRAWER_WIDTH } from "components/LEFT_DRAWER_WIDTH";

const SelectedTweetModal = () => {
  const selectedNode = useSelectedNode();
  const setSelectedNode = useStore((state) => state.setSelectedNode);
  return (
    <Modal open={Boolean(selectedNode)}>
      <SelectedTweetModalStyles>
        <ClickAwayListener onClickAway={() => setSelectedNode(null)}>
          <div /* className="tweetContentWrapper" */>
            {/* {selectedNode && <TweetContent tweet={selectedNode} />} */}
            {selectedNode && (
              <Tweet
                tweetId={selectedNode.id_str}
                options={{ dnt: true, theme: "dark" }}
              />
            )}
          </div>
        </ClickAwayListener>
      </SelectedTweetModalStyles>
    </Modal>
  );
};

const SelectedTweetModalStyles = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  .tweetContentWrapper {
    border-radius: 8px;
    box-sizing: border-box;
    padding: 1.5em;
    background: hsla(0, 0%, 0%, 0.8);
    width: calc(${TOOLTIP_WIDTH * 2}px);
    max-width: calc(100vw - ${LEFT_DRAWER_WIDTH - 64}px);
    max-height: calc(100vh - 48px);
    ${CUSTOM_SHRINKING_SCROLLBAR_CSS}
  }
  .twitter-tweet {
    margin: 64px auto;
  }
`;

export default SelectedTweetModal;
