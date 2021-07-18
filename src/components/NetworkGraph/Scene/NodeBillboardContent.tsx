import { TooltipContent, TooltipStyles } from "../NodeTooltip";
import styled from "styled-components/macro";
import { useIsLight } from "providers/ThemeManager";
import { getOriginalPoster } from "providers/store/useSelectors";
import { Html } from "@react-three/drei";
import { DISABLE_SELECTION_OF_TEXT_CSS } from "utils/constants";

export function NodeBillboardContent({
  tweet,
  onPointerEnter,
  onPointerLeave,
  onClick,
}) {
  const originalPoster = getOriginalPoster(tweet);

  const isLight = useIsLight();
  return (
    <Html
      transform={true}
      sprite={false}
      // style={{ width: 50, height: 50, pointerEvents: "none" }}
    >
      <HtmlStyles>
        <AvatarStyles>
          <img src={originalPoster?.profile_image_url_https} alt="" />
        </AvatarStyles>
        <div
          onMouseEnter={onPointerEnter}
          onMouseLeave={onPointerLeave}
          onClick={onClick}
        >
          <StyledDiv>
            <TooltipStyles
              {...{
                isLight,
                width: 200,
                css: `
      `,
              }}
            >
              <TooltipContent {...{ originalPoster, tweet }} />
            </TooltipStyles>
          </StyledDiv>
          <div></div>
        </div>
      </HtmlStyles>
    </Html>
  );
}
const StyledDiv = styled.div`
  font-size: 12px;
  color: hsla(0, 0%, 95%, 0.9);
  transform: translateY(120px);
  width: 200px;
  height: 200px;
`;

const HtmlStyles = styled.div`
  ${DISABLE_SELECTION_OF_TEXT_CSS}
`;
const AvatarStyles = styled.div`
  width: 100%;
  height: 100%;
  transform: translateY(100px) scale(0.5);
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    height: auto;
  }
`;
