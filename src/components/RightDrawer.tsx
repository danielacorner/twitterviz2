import styled from "styled-components/macro";
import {
  getOriginalPoster,
  useSelectedNode,
  useSetSelectedNode,
} from "../providers/store/useSelectors";
import { Drawer } from "@material-ui/core";
import { Timeline, Tweet as TweetWidget } from "react-twitter-widgets";
import { NodeTooltipContent } from "./NetworkGraph/NodeTooltip";

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
                  tooltipStyles: { pointerEvents: "auto" },
                }}
              />
              {selectedNode && (
                <TweetWidget
                  tweetId={selectedNode.id_str}
                  options={{ theme: "dark" }}
                />
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
  width: 378px;
  padding: 5px;
  box-sizing: content-box;
`;
