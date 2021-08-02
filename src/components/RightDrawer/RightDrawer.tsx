import styled from "styled-components/macro";
import {
  getOriginalPoster,
  useSelectedNode,
  useSetSelectedNode,
} from "../../providers/store/useSelectors";
import { Drawer } from "@material-ui/core";
import { Timeline, Tweet as TweetWidget } from "react-twitter-widgets";
import { NodeTooltipContent } from "../NetworkGraph/NodeTooltip";
import { CUSTOM_SCROLLBAR_CSS } from "components/common/styledComponents";
import TagTheBotButton from "components/Game/TagTheBotButton";

/** Selected Tweet drawer */
export function RightDrawer() {
  const selectedNode = useSelectedNode();
  const setSelectedNode = useSetSelectedNode();
  const originalPoster = selectedNode && getOriginalPoster(selectedNode);
  return (
    <>
      <Drawer
        anchor="right"
        open={Boolean(originalPoster)}
        onClose={() => setSelectedNode(null)}
      >
        <DrawerContentStyles>
          {originalPoster && (
            <>
              <NodeTooltipContent
                {...{
                  isLight: false,
                  originalPoster,
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
                    <div style={{ position: "relative", zIndex: -1 }}>
                      <TweetWidget
                        tweetId={selectedNode.id_str}
                        options={{ theme: "dark" }}
                      />
                    </div>
                  </a>
                  <TagTheBotButton />
                </>
              )}
              <Timeline
                dataSource={{
                  sourceType: "profile",
                  screenName: originalPoster.screen_name,
                }}
                options={{
                  theme: "dark",
                }}
              />
            </>
          )}
        </DrawerContentStyles>
      </Drawer>
    </>
  );
}
const DrawerContentStyles = styled.div`
  min-height: calc(100vh + 128px);
  width: 378px;
  max-width: calc(100vw - 64px);
  padding: 5px;
  box-sizing: content-box;
  *,
  .MuiTypography-root {
    color: white;
  }
  background-color: #4b4b4b;
  ${CUSTOM_SCROLLBAR_CSS}
`;
