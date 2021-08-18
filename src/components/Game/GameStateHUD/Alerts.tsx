import { useAtom } from "jotai";
import { useLatestTaggedNode } from "components/NetworkGraph/Scene/Node/useLatestTaggedNode";
import {
  animated as animatedDom,
  useSpring as useSpringDom,
} from "react-spring";
import Alert from "@material-ui/lab/Alert";
import styled from "styled-components/macro";
import { isBotScoreExplainerUpAtom } from "./BotScoreLegend";

function Alerts() {
  const { /* latestBotScore, */ node, lastNode } = useLatestTaggedNode();
  const latestBotScore = {
    astroturf: 0.33,
    fake_follower: 0.51,
    financial: 0,
    other: 0.63,
    overall: 0.63,
    self_declared: 0.1,
    spammer: 0.09,
  };
  console.log("🌟🚨 ~ Alerts ~ latestBotScore", latestBotScore);
  const isUp = true;
  const [, setIsUp] = useAtom(isBotScoreExplainerUpAtom);
  const springUp = useSpringDom({
    marginBottom: isUp ? 24 : -500,
    pointerEvents: "auto",
  });

  return (
    <AlertContentStyles>
      <animatedDom.div style={springUp as any} className="alerts">
        <Alert
          severity="info"
          onClose={() => {
            setIsUp(false);
          }}
        >
          {latestBotScore ? (
            <>
              <div className="scoreBar">
                <div className="category">Overall </div>
                <div
                  className="value"
                  style={{ width: latestBotScore.overall * 100 + "%" }}
                >
                  {latestBotScore.overall}
                </div>
              </div>
              <div className="scoreBar">
                <div className="category">Astroturf </div>
                <div
                  className="value"
                  style={{ width: latestBotScore.astroturf * 100 + "%" }}
                >
                  {latestBotScore.astroturf}
                </div>
              </div>
              <div className="scoreBar">
                <div className="category"> Fakefollower:</div>{" "}
                <div
                  className="value"
                  style={{ width: latestBotScore.fake_follower * 100 + "%" }}
                >
                  {latestBotScore.fake_follower}{" "}
                </div>
              </div>
              <div className="scoreBar">
                <div className="category">Financial </div>
                <div
                  className="value"
                  style={{ width: latestBotScore.financial * 100 + "%" }}
                >
                  {latestBotScore.financial}
                </div>
              </div>
              <div className="scoreBar">
                <div className="category">Other </div>
                <div
                  className="value"
                  style={{ width: latestBotScore.other * 100 + "%" }}
                >
                  {latestBotScore.other}
                </div>
              </div>
              <div className="scoreBar">
                <div className="category"> Self declared:</div>{" "}
                <div
                  className="value"
                  style={{ width: latestBotScore.self_declared * 100 + "%" }}
                >
                  {latestBotScore.self_declared}{" "}
                </div>
              </div>
              <div className="scoreBar">
                <div className="category">Spammer: </div>
                <div
                  className="value"
                  style={{ width: latestBotScore.spammer * 100 + "%" }}
                >
                  {latestBotScore.spammer}
                </div>
              </div>
            </>
          ) : null}
        </Alert>
      </animatedDom.div>
    </AlertContentStyles>
  );
}
const AlertContentStyles = styled.div`
  pointer-events: none;
  /* width: 100px;
  height: 60px; */
  .MuiAlert-standardInfo {
    background: hsla(0, 0%, 0%, 0.8);
  }
  .MuiAlert-icon {
    display: none;
  }
  .MuiAlert-action {
    align-items: flex-start;
    pointer-events: auto;
  }
  .title {
    font-size: 4px;
  }
  display: grid;
  grid-gap: 1em;
  .scoreBar {
    height: 24px;
    width: 100%;
    font-size: 4px;
    color: #fff;
    font-weight: bold;
    display: grid;
    grid-template-columns: 300px 1fr;
    position: relative;
    .category {
      text-align: left;
      position: absolute;
      left: -2em;
    }
    .value {
      position: absolute;
      left: -1em;
      text-align: right;
    }
  }

  .score:hover {
    color: #fff;
  }

  .score:active {
    color: #fff;
  }
`;
