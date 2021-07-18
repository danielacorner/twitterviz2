import NodeTooltip from "./NodeTooltip";
// https://www.npmjs.com/package/react-force-graph
import styled from "styled-components/macro";
// https://www.npmjs.com/package/d3-force-cluster
import GraphRightClickMenu from "./GraphRightClickMenu";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene/Scene";

export const GraphStyles = styled.div`
  width: 100%;
`;

const NetworkGraph = () => {
  return (
    <GraphStyles>
      {/* <Graph /> */}
      <Graph3D />
      <NodeTooltip />
      <GraphRightClickMenu />
    </GraphStyles>
  );
};

// {...({} as any)} = typescript is busted ?

function Graph3D() {
  return (
    <Graph3DStyles>
      <Canvas
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 100], fov: 35, near: 10, far: 500 }}
      >
        <Scene />
      </Canvas>
    </Graph3DStyles>
  );
}

const Graph3DStyles = styled.div`
  position: fixed;
  inset: 0px;
`;

export default NetworkGraph;
