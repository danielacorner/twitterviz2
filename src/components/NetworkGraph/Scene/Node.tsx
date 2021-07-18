import { useSphere } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import useStore, {
  nodeMouseCoordsAtom,
  selectedNodeHistoryAtom,
} from "providers/store/store";
import { useFrame, useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { getRandPosition } from "./Scene";
import { Billboard, Html } from "@react-three/drei";
import { TooltipContent, TooltipStyles } from "../NodeTooltip";
import { Tweet as TweetWidget } from "react-twitter-widgets";
import styled from "styled-components/macro";
import { getRetweetedUser } from "components/TweetContent/TweetContent";

const nodeMaterial = new THREE.MeshLambertMaterial({
  color: "#a0a090",
  emissive: "red",
});
const RADIUS = 5;
const nodeGeometry = new THREE.SphereGeometry(RADIUS, 28, 28);

export const Node = ({ vec = new THREE.Vector3(), node }) => {
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

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: getRandPosition(-10 * RADIUS, 10 * RADIUS),
    // type: !paused ? "Dynamic" : "Static",
    // https://threejs.org/docs/scenes/geometry-browser.html#IcosahedronBufferGeometry
    args: RADIUS,
  }));

  // apply force toward center
  // copied from https://codesandbox.io/s/zxpv7?file=/src/App.js:1195-1404
  const position = useRef([0, 0, 0]);
  useEffect(() => api.position.subscribe((v) => (position.current = v)), [api]);
  useFrame(() =>
    api.applyForce(
      vec
        .set(...position.current)
        .normalize()
        .multiplyScalar(-10)
        .toArray(),
      [0, 0, 0]
    )
  );

  return (
    <mesh
      ref={ref}
      {...{ onPointerEnter, onClick }}
      material={nodeMaterial}
      geometry={nodeGeometry}
    >
      <Billboard {...({} as any)}>
        <Html
          transform={true}
          sprite={false}
          style={{ width: 50, height: 50, pointerEvents: "none" }}
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
          width: 200,
          css: `
          font-size: 12px;
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
