import { Modal } from "@material-ui/core";
import TweetContent from "components/TweetContent/TweetContent";
import { TOOLTIP_WIDTH } from "components/NetworkGraph/NodeTooltip";
import { useSelectedNode } from "providers/store";
import React from "react";
import styled from "styled-components/macro";

const SelectedTweetModal = () => {
  const selectedNode = useSelectedNode();
  return (
    <Modal open={Boolean(selectedNode)}>
      <SelectedTweetModalStyles>
        <div className="tweetContentWrapper">
          {selectedNode && <TweetContent tweet={selectedNode} />}
        </div>
      </SelectedTweetModalStyles>
    </Modal>
  );
};

const SelectedTweetModalStyles = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  .tweetContentWrapper {
    background: hsla(0, 0%, 0%, 0.8);
    max-width: ${TOOLTIP_WIDTH}px;
  }
`;

export default SelectedTweetModal;
