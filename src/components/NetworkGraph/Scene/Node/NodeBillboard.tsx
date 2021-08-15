import styled from "styled-components/macro";
import { Html, Billboard } from "@react-three/drei";
import { DISABLE_SELECTION_OF_TEXT_CSS } from "utils/constants";
import { UserNode } from "components/NetworkGraph/useUserNodes";

export default function NodeBillboard({
  node,
  hasBotScore,
}: {
  node: UserNode;
  hasBotScore: boolean;
}) {
  return (
    <Billboard {...({} as any)}>
      <Html
        transform={true}
        sprite={false}
        style={{
          width: 0,
          height: 0,
          marginLeft: -100,
          marginTop: -100,
        }}
      >
        <HtmlStyles>
          <AvatarStyles>
            <img src={node?.user?.profile_image_url_https} alt="" />
          </AvatarStyles>
          {/* <TweetsColumn {...{ hasBotScore, tweets, isLight, originalPoster }} /> */}
        </HtmlStyles>
      </Html>
    </Billboard>
  );
}

const HtmlStyles = styled.div`
  pointer-events: none;
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
  pointer-events: none;
  img {
    width: 100%;
    height: auto;
  }
`;
