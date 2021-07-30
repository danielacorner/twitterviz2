import { Button } from "@material-ui/core";
import { useAtom } from "jotai";
import { gameStateAtom, GameStepsEnum } from "providers/store/store";
import TagTheBotButton from "./TagTheBotButton";
import { useStreamNewTweets } from "components/NavBar/useStreamNewTweets";
import { useDeleteAllTweets } from "components/common/useDeleteAllTweets";
import { useLoading, useTweets } from "providers/store/useSelectors";
import styled from "styled-components/macro";
import { useReplaceNodesInDbForUser } from "providers/faunaProvider";

/** renders controls and instructions to play the game */
export function Game() {
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const tweets = useTweets();
  const isGameOver = false;
  const loading = useLoading();

  const { fetchNewTweets } = useStreamNewTweets();
  const deleteAllTweets = useDeleteAllTweets();
  const replaceNodesInDbForUser = useReplaceNodesInDbForUser();
  function startGame() {
    setGameState((p) => ({
      step: GameStepsEnum.lookingAtTweetsWithBotScores,
      startTime: Date.now(),
    }));
    deleteAllTweets().then(() => {
      fetchNewTweets().then((newTweets) => {
        replaceNodesInDbForUser(newTweets);
      });
    });
  }
  function continueGame() {
    setGameState((p) => ({
      step: GameStepsEnum.lookingAtTweetsWithBotScores,
      startTime: Date.now(),
    }));
  }
  return gameState.step === GameStepsEnum.welcome ? (
    <Step1Styles>
      <h3>Twitter Botsketball 🤖🏀</h3>
      <p>
        1. look at 10 twitter accounts and their bot scores from Botometer API
      </p>
      <p>2. look at 10 more twitter accounts, and guess which one is a bot!</p>
      <p style={{ textAlign: "center" }}>
        compete with others to get the highest bot score!
      </p>
      <Button
        variant="contained"
        color="primary"
        onClick={startGame}
        style={{ marginRight: 12 }}
      >
        {tweets.length > 0 ? "Restart" : "Start"}
      </Button>
      {tweets.length > 0 && (
        <Button variant="contained" color="secondary" onClick={continueGame}>
          Continue
        </Button>
      )}
    </Step1Styles>
  ) : gameState.step === GameStepsEnum.lookingAtTweetsWithBotScores ? (
    <>
      {/* <Step2Styles>
				<h3>You have {formattedTime} seconds left to find a bot</h3>
				<h4>botsketball score = bot score / num tweets viewed</h4>
			</Step2Styles> */}
      <Button
        color="secondary"
        disabled={loading}
        variant="contained"
        onClick={() => {
          fetchNewTweets();
        }}
        style={{ top: "20px", textTransform: "none" }}
      >
        Deal me 10 more!
      </Button>
      <TagTheBotButton />
    </>
  ) : isGameOver ? (
    <Step2Styles>
      Sorry, out of time!
      <Button onClick={startGame}>Try again?</Button>
    </Step2Styles>
  ) : null;
}

const Step2Styles = styled.div`
  position: fixed;
  inset: 80px calc(50vw - 200px);
  height: fit-content;
  color: white;
  opacity: 0.7;
  background: hsla(0, 0%, 100%, 0.05);
  border-radius: 16px;
  padding: 16px;
  h4 {
    font-size: 0.8em;
  }
`;
const Step1Styles = styled.div`
  position: fixed;
  inset: calc(50vh - 200px) calc(50vw - 200px);
  height: fit-content;
  background: hsla(0, 0%, 0%, 0.8);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0px 2px 30px 8px hsla(0, 0%, 0%, 0.3);
  p {
    text-align: left;
    margin-bottom: 0.8em;
  }
  h3 {
    margin-bottom: 1em;
  }
  button {
    margin-top: 1em;
  }
`;
