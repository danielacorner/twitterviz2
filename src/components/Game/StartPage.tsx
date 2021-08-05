import { Button } from "@material-ui/core";
import { useLoading } from "providers/store/useSelectors";
import styled from "styled-components/macro";
import { Canvas } from "@react-three/fiber";
import { BotScoreLegend } from "components/Game/GameStateHUD/BotScoreLegend";
import { DeviceOrientationOrbitControls } from "./DeviceOrientationOrbitControls";
import { OrbitControls } from "@react-three/drei";
import { popupBaseCss } from "./popupBaseCss";
import { getIsMobileDevice } from "./Game";
import { useState } from "react";
import { ChevronLeft } from "@material-ui/icons";

export function StartPage({
  startLookingAtTweets,
  resetScoreAndFetchNewTweets,
}) {
  const isLoading = useLoading();

  const [step, setStep] = useState(0);

  return (
    <StartPageStyles>
      <div className="content">
        <h3>Twitter Botsketball 🤖🏀</h3>
        {step === 0 && (
          <>
            <p>Twitter is known to be full of bots.</p>
            <p style={{ marginTop: 16 }}>
              In 2020,{" "}
              <a
                href="https://www.npr.org/sections/coronavirus-live-updates/2020/05/20/859814085/researchers-nearly-half-of-accounts-tweeting-about-coronavirus-are-likely-bots"
                target="_blank"
                rel="noopener noreferrer"
              >
                50% of all accounts spreading messages about the coronavirus
                pandemic
              </a>{" "}
              and{" "}
              <a
                href="https://www.marketwatch.com/story/about-half-of-the-twitter-accounts-calling-for-reopening-america-are-probably-bots-report-2020-05-26"
                target="_blank"
                rel="noopener noreferrer"
              >
                82% of the top 50 most influential coronavirus/COVID-19
                retweeters
              </a>{" "}
              were bots.
            </p>
            <p style={{ marginTop: 16 }}>There are different kinds of bot:</p>
            <div style={{ margin: "auto", width: "fit-content" }}>
              <Canvas style={{ width: 240, height: 240 }}>
                {getIsMobileDevice() ? (
                  <DeviceOrientationOrbitControls />
                ) : (
                  <OrbitControls {...({} as any)} />
                )}
                <BotScoreLegend
                  isInStartMenu={true}
                  position={[0, 0.2, 0]}
                  scale={[1.3, 1.3, 1.3]}
                />
              </Canvas>
            </div>
            <Button
              disabled={isLoading}
              variant="contained"
              color={"primary"}
              onClick={() => {
                setStep(1);
              }}
            >
              Next
            </Button>
          </>
        )}
        {step === 1 && (
          <>
            <p>
              I'll fetch 10 random twitter accounts from{" "}
              <a
                href="https://developer.twitter.com/en/docs/tutorials/consuming-streaming-data"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter Stream
              </a>
            </p>
            <p>You guess which ones are bots 🔍</p>
            <p>
              Then we'll get their "bot score" from{" "}
              <a href="https://botometer.osome.iu.edu/">Botometer</a> and see
              how well you did.
            </p>
            <div style={{ fontSize: 14, marginTop: 12 }}>
              ( 🤖 higher bot score = more points ⭐ )
            </div>
            <div
              style={{
                fontStyle: "italic",
                fontSize: 14,
                marginBottom: 0,
                marginTop: 16,
              }}
            >
              <p style={{ marginBottom: 0 }}>Take your shot,</p>
              <p>guess which one is a bot!</p>
            </div>

            <Button
              disabled={isLoading}
              variant="contained"
              color={"primary"}
              onClick={() => {
                resetScoreAndFetchNewTweets();
                startLookingAtTweets();
                setStep(0);
              }}
            >
              Play
            </Button>

            <Button
              className="btnPrev"
              disabled={isLoading}
              color={"primary"}
              onClick={() => {
                setStep(0);
              }}
              startIcon={<ChevronLeft />}
            >
              Prev
            </Button>
          </>
        )}
        <div className="numSteps">{step + 1}/2</div>
      </div>
    </StartPageStyles>
  );
}
const StartPageStyles = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  justify-items: center;
  box-shadow: 0px 2px 30px 8px hsla(0, 0%, 0%, 0.3);
  .content {
    position: relative;
    margin-top: 120px;
    ${popupBaseCss}
    max-width: calc(100vw - 32px);
    @media (min-width: 768px) {
      max-width: 600px;
    }
  }
  p {
    text-align: center;
    margin-bottom: 0.5em;
  }
  h3 {
    margin-bottom: 1em;
  }
  button {
    margin-top: 1em;
  }
  .btnPrev {
    position: absolute;
    left: 32px;
  }
  .numSteps {
    position: absolute;
    right: 13px;
    color: gray;
  }
  a {
    text-decoration: none;
    color: cornflowerblue !important;
    &:visited {
      color: cornflowerblue !important;
    }
  }
`;
