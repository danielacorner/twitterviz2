import { useConvexPolyhedron } from "@react-three/cannon";
import { Suspense, useMemo } from "react";
import { toConvexProps } from "./toConvexProps";
import * as THREE from "three";
import useStore, {
  nodeMouseCoordsAtom,
  selectedNodeHistoryAtom,
} from "providers/store/store";
import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { getRandPosition } from "./Scene";
import { Billboard, Html } from "@react-three/drei";
import { TooltipContent, TooltipStyles } from "../NodeTooltip";
import { Tweet as TweetWidget } from "react-twitter-widgets";
import styled from "styled-components/macro";
import { getRetweetedUser } from "components/TweetContent/TweetContent";
import { DISABLE_SELECTION_OF_TEXT_CSS } from "utils/constants";

export const Node = ({ node }) => {
  const radius = 1;
  const detail = 1;
  const geo = useMemo(
    () => toConvexProps(new THREE.IcosahedronBufferGeometry(radius, detail)),
    [radius, detail]
  );
  const [nodeMouseCoords, setNodeMouseCoords] = useAtom(nodeMouseCoordsAtom);
  const setTooltipNode = useStore((state) => state.setTooltipNode);
  const setSelectedNode = useStore((state) => state.setSelectedNode);

  const { mouse } = useThree();
  const onPointerEnter = () => {
    console.log("🌟🚨 ~ Node ~ nodeMouseCoords", nodeMouseCoords);
    console.log("🌟🚨 ~ Node ~ mouse", mouse);
    setTooltipNode(node);
    setNodeMouseCoords(mouse);
  };
  const onClick = () => {
    setSelectedNode(node);
    setNodeMouseCoords(mouse);
  };

  const [ref, api] = useConvexPolyhedron(() => ({
    mass: 1,
    position: getRandPosition(-10, 10),
    // type: !paused ? "Dynamic" : "Static",
    // https://threejs.org/docs/scenes/geometry-browser.html#IcosahedronBufferGeometry
    args: geo as any,
  }));

  // const position = useRef([0, 0, 0]);
  // useMount(() => {
  //   const unsubscribe = api.position.subscribe(
  //     (v) => (position.current = v)
  //   ) as any;
  //   return () => unsubscribe();
  // });
  // useFrame(({ clock }) => {
  //   console.log("🌟🚨 ~ useFrame ~ clock", clock);
  //   const shouldTick = Math.round(clock.elapsedTime * 100) % 10 === 0;
  //   console.log("🌟🚨 ~ useFrame ~ shouldTick", shouldTick);
  //   if (shouldTick) {
  //     const [x, y, z] = position.current.map((xyz) => -xyz / 1);
  //     // api.position.set(x, y, z);
  //     return;
  //   }
  // });

  return (
    <mesh ref={ref} {...{ onPointerEnter, onClick }}>
      <sphereBufferGeometry />
      <meshBasicMaterial />
      <Billboard {...({} as any)}>
        <Html
          className="react-player-wrapper"
          transform={true}
          sprite={false}
          style={{ width: 50, height: 50, pointerEvents: "none" }}
          // style={{
          //   width: 530 * PLAYER_SCALE,
          //   height: 300 * PLAYER_SCALE,
          // }}
        >
          <NodeBillboardContent
            {...{
              tweet: node,
            }}
          />
        </Html>
      </Billboard>
    </mesh>
  );
};

function NodeBillboardContent({ tweet }) {
  console.log("🌟🚨 ~ NodeBillboardContent ~ tweet", tweet);
  const [selectedNodeHistory] = useAtom(selectedNodeHistoryAtom);

  // show tweets of selected nodes only
  const showTweet = selectedNodeHistory
    .map((n) => n.id_str)
    .includes(tweet.id_str);
  const retweetedUser = getRetweetedUser(tweet);
  const originalPoster = retweetedUser ? retweetedUser : tweet?.user;

  return (
    <StyledDiv>
      <TooltipStyles
        {...{
          isLight: false,
          css: `
transform: scale(0.2);
      `,
        }}
      >
        <TooltipContent {...{ originalPoster, tweet }} />
      </TooltipStyles>
      {showTweet && (
        <TweetWidget
          tweetId={tweet.id_str}
          options={{ dnt: true, theme: "dark" }}
        />
      )}
    </StyledDiv>
  );
}
const StyledDiv = styled.div`
  width: 200px;
  height: 200px;
`;
