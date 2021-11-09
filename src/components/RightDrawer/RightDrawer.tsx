import styled from "styled-components/macro";
import {
  useSelectedNode,
  useSetSelectedNode,
} from "../../providers/store/useSelectors";
import { Drawer, IconButton } from "@material-ui/core";
import { Timeline, Tweet as TweetWidget } from "react-twitter-widgets";
import { NodeTooltipContent } from "../NetworkGraph/NodeTooltip";
import { CUSTOM_SCROLLBAR_CSS } from "components/common/styledComponents";
import { Close } from "@material-ui/icons";
import { isRightDrawerOpenAtom } from "providers/store/store";
import { useAtom } from "jotai";
const DRAWER_WIDTH = 623;

/** Selected Tweet drawer */
export function RightDrawer() {
  const selectedNode = useSelectedNode();
  const setSelectedNode = useSetSelectedNode();
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useAtom(
    isRightDrawerOpenAtom
  );
  return (
    <>
      <Drawer
        anchor="right"
        open={isRightDrawerOpen}
        onClose={() => {
          setIsRightDrawerOpen(false);
          setSelectedNode(null);
        }}
        PaperProps={{
          style: {
            position: "fixed",
            // left: `calc(50vw - ${DRAWER_WIDTH / 4}px)`,
            left: 0,
            width: `100vw`,

            justifyContent: "center",
            display: "grid",
            right: 0,
          },
        }}
      >
        <DrawerStyles>
          {selectedNode?.user && (
            <div className="content">
              <IconButton
                className="btnClose"
                onClick={() => {
                  setIsRightDrawerOpen(false);
                  setSelectedNode(null);
                }}
              >
                <Close />
              </IconButton>
              <NodeTooltipContent
                {...{
                  isLight: false,
                  originalPoster: selectedNode?.user,
                  tweet: selectedNode,
                  tooltipCss: `.allMedia{max-height:unset}`,
                  compact: false,
                  tooltipStyles: { pointerEvents: "auto", maxWidth: "100%" },
                }}
              />
              {selectedNode && (
                <>
                  <a
                    href={`https://twitter.com/${selectedNode.user.screen_name}/status/${selectedNode.id_str}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      style={{
                        position: "relative",
                        zIndex: 0,
                        pointerEvents: "none",
                      }}
                    >
                      <TweetWidget
                        tweetId={selectedNode.id_str || String(selectedNode.id)}
                        options={{ theme: "dark" }}
                      />
                    </div>
                  </a>
                  {selectedNode.user.pinned_tweet_id && (
                    <div className="pinnedTweet">
                      <div className="pinnedTweetIndicator">
                        <div className="icon">
                          <PinnedTweetIcon />
                        </div>
                        <div className="text">Pinned Tweet</div>
                      </div>
                      <TweetWidget
                        tweetId={selectedNode.user.pinned_tweet_id}
                        options={{ theme: "dark" }}
                      />
                    </div>
                  )}
                </>
              )}
              <Timeline
                dataSource={{
                  sourceType: "profile",
                  screenName:
                    selectedNode?.user.screen_name ||
                    selectedNode?.user.username,
                }}
                options={{
                  theme: "dark",
                }}
              />
            </div>
          )}
        </DrawerStyles>
      </Drawer>
    </>
  );
}
const DrawerStyles = styled.div`
  position: relative;
  width: 378px;
  max-width: calc(100vw - 48px);
  height: 100vh;
  background: #15232e9f !important;
  .pinnedTweet {
    margin-top: 24px;
    position: relative;
    .pinnedTweetIndicator {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      position: absolute;
      font-size: 14px;
      top: -20px;
      left: 12px;
      .text {
        color: darkgrey;
      }
      .icon {
        width: 16px;
        height: 16px;
        fill: darkgrey;
      }
    }
  }
  .content {
    height: 100%;
    min-height: 100vh;
    padding: 5px 5px 64px;
    ${CUSTOM_SCROLLBAR_CSS}
  }
  .btnClose {
    position: fixed;
    top: 0;
    left: 0;
  }
  box-sizing: content-box;
  *,
  .MuiTypography-root {
    color: white;
  }
  background-color: #4b4b4b;
`;

function PinnedTweetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <g>
        <path d="M20.235 14.61c-.375-1.745-2.342-3.506-4.01-4.125l-.544-4.948 1.495-2.242c.157-.236.172-.538.037-.787-.134-.25-.392-.403-.675-.403h-9.14c-.284 0-.542.154-.676.403-.134.25-.12.553.038.788l1.498 2.247-.484 4.943c-1.668.62-3.633 2.38-4.004 4.116-.04.16-.016.404.132.594.103.132.304.29.68.29H8.64l2.904 6.712c.078.184.26.302.458.302s.38-.118.46-.302l2.903-6.713h4.057c.376 0 .576-.156.68-.286.146-.188.172-.434.135-.59z"></path>
      </g>
    </svg>
  );
}
