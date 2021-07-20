import { TooltipContent, TooltipStyles } from "../NodeTooltip";
import styled from "styled-components/macro";
import { useIsLight } from "providers/ThemeManager";
import { getOriginalPoster } from "providers/store/useSelectors";
import { Html } from "@react-three/drei";
import { DISABLE_SELECTION_OF_TEXT_CSS } from "utils/constants";
import { useHandleOpenRightClickMenu } from "../GraphRightClickMenu";

export function NodeBillboardContent({
  tweets,
  onPointerEnter,
  onPointerLeave,
  onScroll,
  onClick,
}) {
  const isLight = useIsLight();
  const originalPoster = getOriginalPoster(tweets[0]);
  const openRightClickMenu = useHandleOpenRightClickMenu(tweets[0]);
  return (
    <Html
      transform={true}
      sprite={false}
      // style={{ width: 50, height: 50, pointerEvents: "none" }}
    >
      <HtmlStyles>
        <AvatarStyles onContextMenu={openRightClickMenu}>
          <img src={originalPoster?.profile_image_url_https} alt="" />
        </AvatarStyles>
        <div
          className="mouseArea"
          onMouseEnter={onPointerEnter}
          onMouseLeave={onPointerLeave}
          onWheel={onScroll}
          style={{ padding: "200px 100px", margin: "-200px -100px" }}
          onClick={onClick}
        >
          <TweetsColumnStyles>
            {tweets.map((tweet) => (
              <TooltipStyles
                {...{
                  isLight,
                  width: 200,
                  css: `
                .id_str {display:none;}
      `,
                }}
              >
                <TooltipContent {...{ originalPoster, tweet }} />
              </TooltipStyles>
            ))}
          </TweetsColumnStyles>
          <div></div>
        </div>
      </HtmlStyles>
    </Html>
  );
}

const HtmlStyles = styled.div`
  ${DISABLE_SELECTION_OF_TEXT_CSS}
  position: relative;
  width: 200px;
`;
const AvatarStyles = styled.div`
  width: 100%;
  height: 100%;
  transform: scale(0.5);
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    height: auto;
  }
`;
const TweetsColumnStyles = styled.div`
  position: absolute;
  top: 96px;
  font-size: 12px;
  color: hsla(0, 0%, 95%, 0.9);
  transform: translateY(120px);
  min-height: 200px;
  display: grid;
  gap: 12px;
`;
