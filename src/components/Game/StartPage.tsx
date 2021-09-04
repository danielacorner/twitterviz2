import { Button } from "@material-ui/core";
import { useLoading } from "providers/store/useSelectors";
import styled from "styled-components/macro";
import { Canvas } from "@react-three/fiber";
import { BotScoreLegend } from "components/Game/GameStateHUD/BotScoreLegend";
import { POPUP_BASE_CSS } from "./popupBaseCss";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import COVIDSVG from "./COVIDSVG";
import { colorLink, colorSecondary } from "utils/colors";
import { useAtom } from "jotai";
import { isMusicOnAtom } from "providers/store/store";
import { CUSTOM_SCROLLBAR_CSS } from "components/common/styledComponents";

export function StartPage({ startLookingAtTweets }) {
  const isLoading = useLoading();

  const [step, setStep] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useAtom(isMusicOnAtom);

  return (
    <StartPageStyles>
      <div className="content">
        <h1 className="title font-effect-shadow-multiple">Plenty of Bots 🎣</h1>
        {step === 0 && (
          <>
            <p>Twitter is full of bots 🤖</p>
            <p>In 2020 for example, </p>
            <p style={{ marginBottom: 0 }}>
              <ul style={{ textAlign: "left" }}>
                <li>
                  <a
                    href="https://www.npr.org/sections/coronavirus-live-updates/2020/05/20/859814085/researchers-nearly-half-of-accounts-tweeting-about-coronavirus-are-likely-bots"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span style={{ fontWeight: "bold", color: colorLink }}>
                      50%
                    </span>{" "}
                    <span style={{ fontSize: "0.8em", color: colorLink }}>
                      of all accounts spreading messages about COVID-19
                    </span>
                  </a>
                  , and{" "}
                </li>
                <li>
                  <a
                    href="https://www.marketwatch.com/story/about-half-of-the-twitter-accounts-calling-for-reopening-america-are-probably-bots-report-2020-05-26"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span style={{ fontWeight: "bold", color: colorLink }}>
                      82%
                    </span>{" "}
                    <span style={{ fontSize: "0.8em", color: colorLink }}>
                      of the most influential COVID-19 retweeters
                    </span>
                  </a>{" "}
                </li>
              </ul>
            </p>
            <p style={{ marginTop: "0.5em" }}>were bots.</p>

            <Button
              disabled={isLoading}
              variant="contained"
              color={"primary"}
              onClick={() => {
                if (!isAudioPlaying) {
                  setIsAudioPlaying(true);
                }
                setStep((p) => p + 1);
              }}
            >
              Next
            </Button>
          </>
        )}
        {step === 1 && (
          <>
            <p>There are different kinds of bot:</p>
            <div className="canvasContainer">
              <Canvas style={{ width: 480, height: 360 }}>
                <BotScoreLegend
                  showScorePercents={false}
                  showTooltips={true}
                  showAvatar={false}
                  isInStartMenu={true}
                  position={[0, 0.2, 0]}
                  scale={[2.5, 2.5, 2.5]}
                />
              </Canvas>
            </div>
            <div className="buttonsRow">
              <Button
                className="btnPrev"
                variant="outlined"
                disabled={isLoading}
                color={"primary"}
                onClick={() => {
                  setStep((p) => p - 1);
                }}
                startIcon={<ChevronLeft />}
              >
                Prev
              </Button>
              <Button
                disabled={isLoading}
                variant="contained"
                color={"primary"}
                onClick={() => {
                  setStep((p) => p + 1);
                }}
                endIcon={<ChevronRight />}
              >
                Next
              </Button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <p>With practice, you might get better at identifying bots!</p>
            <ol>
              <li>
                <p>
                  🕵️‍♀️ Inspect 10 recent tweets about COVID{" "}
                  <span style={{ verticalAlign: "middle" }}>
                    <COVIDSVG />
                  </span>{" "}
                  (from{" "}
                  <a
                    href="https://developer.twitter.com/en/docs/tutorials/consuming-streaming-data"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: "bold" }}
                  >
                    Twitter Stream
                  </a>
                  )
                </p>
              </li>
              <li>
                <p>🎯 Guess which ones are bots</p>
              </li>
              <li>
                <p>
                  🤖 Then we'll get their{" "}
                  <span style={{ fontWeight: "bold" }}>
                    <a href="https://botometer.osome.iu.edu/">Botometer</a> bot
                    score
                  </span>{" "}
                  and see how well you did.
                </p>
              </li>
            </ol>
            <div className="takeYourShot">
              <p>Take your shot,</p>
              <p>guess which one's a bot!</p>
            </div>
            <div className="buttonsRow">
              <Button
                className="btnPrev"
                variant="outlined"
                disabled={isLoading}
                color={"primary"}
                onClick={() => {
                  setStep((p) => p - 1);
                }}
                startIcon={<ChevronLeft />}
              >
                Prev
              </Button>
              <Button
                disabled={isLoading}
                variant="contained"
                color={"primary"}
                onClick={() => {
                  setStep(0);
                  startLookingAtTweets();
                  if (!isAudioPlaying) {
                    setIsAudioPlaying(true);
                  }
                }}
              >
                Play
              </Button>
            </div>
          </>
        )}
        <div className="numSteps">{step + 1}/2</div>
      </div>
    </StartPageStyles>
  );
}
const StartPageStyles = styled.div`
  font-family: "Roboto", sans-serif;
  font-size: 1.5rem;
  .title {
    font-family: "Rancho", cursive;
    font-size: 6em;
    margin: 0.5em 0 64px;
    line-height: 1em;
  }

  position: fixed;
  inset: 0;
  display: grid;
  justify-items: center;
  .content {
    ${CUSTOM_SCROLLBAR_CSS}
    line-height: 1.5em;
    box-shadow: 0px 2px 30px 8px #00000068;
    position: relative;
    margin-top: 72px;
    max-height: calc(100vh - 72px - 16px);
    overflow: auto;
    ${POPUP_BASE_CSS}
    max-width: calc(100vw - 32px);
    @media (min-width: 768px) {
      max-width: 640px;
    }
  }
  .canvasContainer {
    display: flex;
    justify-content: center;
    margin-bottom: 1em;
  }
  p {
    text-align: center;
    margin: 1em;
  }
  ol p {
    text-align: left;
  }
  button {
    margin-top: 1em;
    width: 100%;
  }
  .btnPrev {
    text-transform: none;
  }
  .numSteps {
    position: absolute;
    bottom: 0;
    right: 13px;
    color: ${colorSecondary};
    display: none;
  }
  .buttonsRow {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 10px;
  }
  li {
    margin-bottom: 0.5em;
    line-height: 1.1em;
    p {
      margin-bottom: 0.5em;
    }
    &:first-child p {
      margin-bottom: 0.2em;
    }
  }
  a {
    text-decoration: none;
    color: ${colorLink} !important;
    &:visited {
      color: ${colorLink} !important;
    }
  }
  .takeYourShot {
    margin-top: 3em;
    margin-bottom: 2.5em;
    font-style: italic;
    font-size: 14px;
    line-height: 0;
  }
  @media (min-width: 768px) {
    .content {
      padding: 3em;
    }
    .title {
      font-size: 6em;
    }
    p {
      font-size: 1.5em;
      line-height: 1.2em;
    }
  }
`;
