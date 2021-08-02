import { useLoading } from "../providers/store/useSelectors";
import { animated, useSpring } from "@react-spring/three";
import { NodeContent } from "components/NetworkGraph/Scene/Node";
import { Canvas } from "@react-three/fiber";
import styled from "styled-components/macro";
import { Modal } from "@material-ui/core";
import { useAtom } from "jotai";
import { botScorePopupNodeAtom } from "providers/store/store";

/** pops up and animates when you get a new bot score */
export function BotScorePopupNode() {
  const isLoading = useLoading();

  const [node] = useAtom(botScorePopupNodeAtom);
  const springProps = useSpring({
    opacity: node ? 1 : 0,
    scale: node ? [1, 1, 1] : [0, 0, 0],
  });
  console.log("🌟🚨 ~ BotScorePopupNode ~ node", node);
  return (
    <PopupStyles>
      <Modal open={Boolean(node)}>
        <ContentStyles>
          <Canvas style={{ width: 200, height: 200, zIndex: 999999999999999 }}>
            <animated.mesh
              // transparent={true}
              // opacity={springProps.opacity}
              // scale={[1, 1, 1]}
              scale={springProps.scale}
            >
              {node ? (
                <NodeContent
                  {...{
                    node,
                    isTooltipNode: false,
                    isPointerOver: false,
                    isRightClickingThisNode: false,
                  }}
                />
              ) : null}
            </animated.mesh>
            <directionalLight intensity={2} />
          </Canvas>
        </ContentStyles>
      </Modal>
    </PopupStyles>
  );
}

const ContentStyles = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 9999999999999999999;
`;
const PopupStyles = styled.div`
  pointer-events: none;
`;
