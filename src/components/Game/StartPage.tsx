import { Button, useMediaQuery } from "@material-ui/core";
import { useLoading } from "providers/store/useSelectors";
import styled from "styled-components/macro";
import { Canvas } from "@react-three/fiber";
import { BotScoreLegend } from "components/Game/GameStateHUD/BotScoreLegend";
import { POPUP_BASE_CSS } from "./popupBaseCss";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import COVIDSVG from "./COVIDSVG";
import { colorLink, colorSecondary, darkBackground } from "utils/colors";
import { useAtom } from "jotai";
import { isMusicOnAtom } from "providers/store/store";
import { CUSTOM_SCROLLBAR_CSS } from "components/common/styledComponents";
import { BOT_TYPES, MARGIN_TOP } from "utils/constants";
import { useInterval } from "utils/useInterval";
import ErrorBoundary from "components/ErrorBoundary3D";
import { useStartLookingAtTweets } from "./Game";
import { Title } from "./Title";

export function StartPage() {
  const isLoading = useLoading();
  const [startPageStep, setStartPageStep] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useAtom(isMusicOnAtom);
  const isTabletOrLarger = useMediaQuery(`(min-width: ${768}px)`);
  const startLookingAtTweets = useStartLookingAtTweets();

  const isMinimized = startPageStep > 0;

  const startGame = () => {
    if (startPageStep !== 0) {
      setStartPageStep(0);
    }
    startLookingAtTweets();
    if (!isAudioPlaying) {
      setIsAudioPlaying(true);
    }
  };

  const BtnSkip = () => (
    <Button color={"secondary"} onClick={startGame}>
      Skip
    </Button>
  );
  const BtnNext = () => (
    <Button
      disabled={isLoading}
      variant="contained"
      color={"primary"}
      onClick={() => {
        setStartPageStep((p) => p + 1);
      }}
      endIcon={<ChevronRight />}
    >
      Next
    </Button>
  );
  const BtnPrev = () => (
    <Button
      className="btnPrev"
      variant="outlined"
      disabled={isLoading}
      color={"primary"}
      onClick={() => {
        setStartPageStep((p) => p - 1);
      }}
      startIcon={<ChevronLeft />}
    >
      Prev
    </Button>
  );
  const BtnPlay = () => (
    <Button
      disabled={isLoading}
      variant="contained"
      color={"primary"}
      onClick={startGame}
    >
      Play
    </Button>
  );
  return (
    <StartPageStyles>
      <Title {...{ isMinimized }} />
      <div className="content">
        {startPageStep === 0 && (
          <>
            {/* space for the title */}
            <div style={{ height: 100 }} />

            <p style={{ textAlign: "center", marginBottom: "2em" }}>
              Twitter is full of bots 🤖
            </p>
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
                      of all accounts spreading messages about COVID-19 were
                      bots
                    </span>
                  </a>
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
                      of the most influential COVID-19 retweeters were bots
                    </span>
                  </a>
                </li>
              </ul>
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gridGap: "0.5em",
              }}
            >
              <BtnNext />
              <BtnSkip />
            </div>
          </>
        )}
        {startPageStep === 1 && (
          <ErrorBoundary>
            <p>These days, AI generates realistic fake avatars:</p>
            <div className="thisPersonDoesNotExist">
              <a
                href="https://thispersondoesnotexist.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="person" style={{ pointerEvents: "none" }}>
                  <ReloadingIframe delay={2500} />
                </div>
              </a>
            </div>
            <a
              href="https://thispersondoesnotexist.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ThisPersonDoesNotExist.com
            </a>
            <div style={{ marginBottom: "1em" }}></div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gridGap: "0.5em",
              }}
            >
              <BtnPrev />
              <BtnNext />
              <BtnSkip />
            </div>
          </ErrorBoundary>
        )}
        {startPageStep === 2 && (
          <>
            <p style={{ marginBottom: 0, marginTop: -18 }}>
              There are different kinds of bot:
            </p>
            <div className="canvasContainer">
              <Canvas
                style={{
                  width: isTabletOrLarger ? 480 : 360,
                  height: isTabletOrLarger ? 360 : 240,
                }}
              >
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
            <p style={{ marginTop: 0 }}>
              Watch out! Some bots distort the truth:
            </p>
            <ul style={{ textAlign: "left" }} className="">
              <li>
                <span style={{ fontWeight: "bold" }}>Fake Follower</span> —{" "}
                {BOT_TYPES.FAKE_FOLLOWER.tooltipText}
              </li>
              <li>
                <span style={{ fontWeight: "bold" }}>Echo Chamber</span> —{" "}
                {BOT_TYPES.ASTROTURF.tooltipText}
              </li>
            </ul>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto",
                gridGap: "0.5em",
              }}
            >
              <BtnPrev />
              <BtnNext />
              <BtnSkip />
            </div>
          </>
        )}
        {startPageStep === 3 && (
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gridGap: "0.5em",
              }}
            >
              <BtnPrev />
              <BtnPlay />
            </div>
          </>
        )}
        <div className="numSteps">{startPageStep + 1}/2</div>
      </div>
    </StartPageStyles>
  );
}
const StartPageStyles = styled.div`
  font-family: "Roboto", sans-serif;
  font-size: 1.5rem;
  z-index: 99999;
  position: fixed;
  inset: 0;
  display: grid;
  justify-items: center;

  .content {
    font-size: 1rem;
    margin-top: ${MARGIN_TOP}px;
    ${CUSTOM_SCROLLBAR_CSS}
    line-height: 1.5em;
    box-shadow: 0px 2px 30px 8px #00000068;
    position: relative;
    max-height: calc(100vh - ${MARGIN_TOP + 16}px);
    min-height: calc(fit-content + 1px);
    overflow: auto;
    ${POPUP_BASE_CSS}
    max-width: calc(100vw - 32px);

    ul,
    ol {
      padding-left: 16px;
    }
    li::marker {
      font-size: 1em;
    }
  }
  .canvasContainer {
    display: flex;
    justify-content: center;
    margin-bottom: 1em;
  }
  p {
    text-align: left;
    margin-bottom: 1em;
    line-height: 1.5em;
  }
  ol p,
  li p {
    text-align: left;
    line-height: 1.2em;
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

  li {
    margin-bottom: 1em;
    line-height: 1.3em;
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
    margin: 1em 0 0.5em;
    font-style: italic;
    font-size: 14px;
    line-height: 0;
    p {
      text-align: center;
      margin: 0;
    }
  }
  .thisPersonDoesNotExist {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5em;
    margin-top: 1em;
    margin-bottom: 0.5em;
    .person {
      width: 256px;
      height: 256px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid ${darkBackground};
      iframe {
        width: 100%;
        height: 100%;
      }
    }
  }
  @media (min-width: 768px) {
    .buttonsRow {
      grid-gap: 2em;
    }
    button {
      font-size: 1.5em;
    }
    .MuiSvgIcon-root {
      width: 1.5em;
      height: 1.5em;
    }

    .content {
      padding: 3em 3.5em;
      max-width: 640px;
      margin-top: ${MARGIN_TOP * 2}px;

      li::marker {
        font-size: 1.5em;
      }
    }
    p {
      font-size: 1.5em;
      line-height: 1.5em;
      margin: 1em 0;
    }
    &&&&&&&&&& {
      ul,
      ol {
        padding-left: 26px;
      }
    }
  }
`;

function ReloadingIframe({ delay }) {
  const [randKey, setRandKey] = useState(0);
  useInterval({
    callback: () => {
      setRandKey(Math.random());
    },
    delay,
    immediate: false,
  });
  return (
    <iframe
      key={randKey}
      title="This Person Does Not Exist"
      src="https://thispersondoesnotexist.com/"
      frameBorder="0"
    ></iframe>
  );
}
