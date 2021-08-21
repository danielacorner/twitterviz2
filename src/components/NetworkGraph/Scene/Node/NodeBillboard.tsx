import styled from "styled-components/macro";
import { Html, Billboard } from "@react-three/drei";
import { DISABLE_SELECTION_OF_TEXT_CSS } from "utils/constants";
import { UserNode } from "components/NetworkGraph/useUserNodes";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function NodeBillboard({
  node,
  hasBotScore,
}: {
  node: UserNode;
  hasBotScore: boolean;
}) {
  // slowly randomly rotate the billboard content
  const delay = useRef(Math.random() * Math.PI);
  const ref = useRef(null as any);
  useFrame(({ clock }) => {
    if (!ref.current) {
      return;
    }
    const turnPercent = 0.16;
    const speed = 0.5;
    const roty =
      Math.sin((clock.getElapsedTime() - delay.current) * speed) *
      Math.PI *
      turnPercent;
    ref.current.rotation.y = roty;
  });
  return (
    <Billboard {...({} as any)}>
      <mesh ref={ref}>
        <Html
          transform={true}
          sprite={false}
          style={{
            width: 0,
            height: 0,
            marginLeft: -100,
            marginTop: -100,
            opacity: 0.8,
          }}
        >
          <HtmlStyles>
            <AvatarStyles>
              <img
                src={
                  node?.user.profile_image_url_https ||
                  node?.user.profile_image_url
                }
                alt=""
              />
            </AvatarStyles>
            {/* <TweetsColumn {...{ hasBotScore, tweets, isLight, originalPoster }} /> */}
          </HtmlStyles>
        </Html>
      </mesh>
    </Billboard>
  );
}

const HtmlStyles = styled.div`
  pointer-events: none;
  ${DISABLE_SELECTION_OF_TEXT_CSS}
  position: relative;
  width: 200px;
`;
export const AvatarStyles = styled.div`
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
