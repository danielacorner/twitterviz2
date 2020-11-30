import styled from "styled-components/macro";
import { CONTROLS_WIDTH } from "../../utils/constants";
import { USER_INFO_WIDTH } from "../common/UserInfo";
import { PADDING } from "../../utils/utils";

export const DRAWER_HEIGHT = 400;

export const BottomDrawerStyles = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: ${CONTROLS_WIDTH}px;
`;

export const DrawerContentStyles = styled.div`
  box-sizing: border-box;
  padding: 32px 16px 0px;
  position: relative;
  height: ${(props) => props.drawerHeight}px;
  .viewTweet {
    position: absolute;
    right: 16px;
    bottom: 16px;
    transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  }
  .userAndTweetWrapper {
    height: 100%;
    display: grid;
    grid-gap: ${PADDING}px;
    grid-template-columns: ${USER_INFO_WIDTH}px 1fr;
  }
  .userWrapper {
    margin-top: -143px;
  }
  .btnClose {
    position: absolute;
    top: 0;
    right: 0;
  }
  .tweetContentWrapper {
    height: 100%;

    /* max-height: 900px; */
  }
  .MuiDrawer-paper,
  .MuiDrawer-root {
    transition: all 225ms cubic-bezier(0, 0, 0.2, 1) 0ms !important;
  }
`;
