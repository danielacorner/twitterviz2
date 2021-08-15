import styled from "styled-components/macro";
import {
  useSelectedNode,
  useSetSelectedNode,
} from "../../providers/store/useSelectors";
import { Drawer, IconButton } from "@material-ui/core";
import { Timeline, Tweet as TweetWidget } from "react-twitter-widgets";
import { NodeTooltipContent } from "../NetworkGraph/NodeTooltip";
import { CUSTOM_SCROLLBAR_CSS } from "components/common/styledComponents";
import TagTheBotButton from "components/Game/TagTheBotButton";
import { Close } from "@material-ui/icons";
import { isRightDrawerOpenAtom } from "providers/store/store";
import { useAtom } from "jotai";

/** Selected Tweet drawer */
export function RightDrawer() {
  const selectedNode = useSelectedNode();
  console.log("🌟🚨 ~ RightDrawer ~ selectedNode", selectedNode);
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
                        tweetId={selectedNode.id_str}
                        options={{ theme: "dark" }}
                      />
                    </div>
                  </a>
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
          {selectedNode && <TagTheBotButton />}
        </DrawerStyles>
      </Drawer>
    </>
  );
}
const DrawerStyles = styled.div`
  position: relative;
  width: 378px;
  max-width: calc(100vw - 64px);
  height: 100vh;
  background: #15232e9f !important;
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
