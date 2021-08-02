import { faunaClient } from "providers/faunaProvider";
import { query as q } from "faunadb";
import { sortDescendingByScore } from "./sortDescendingByScore";

export function useDeleteAllHighScores() {
  return () =>
    faunaClient.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("player_scores"))),
        q.Lambda((x) => q.Delete(x))
      )
    );
}
export type HighScore = {
  userId: string;
  name: string;
  isNewHighScore?: boolean;
  score: number;
};
export function fetchAllHighScoresSorted(): Promise<HighScore[]> {
  // get all documents https://stackoverflow.com/questions/61488323/how-to-get-all-documents-from-a-collection-in-faunadb
  return faunaClient
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("player_scores"))),
        q.Lambda((x) => q.Get(x))
      )
    )
    .then((ret) => {
      console.log("🌟🚨 ~ .then ~ ret", ret);
      const scores = (ret as any).data?.map((d) => d.data) || [];
      console.log("🌟🚨 ~ .then ~ scores", scores);
      const highScoresSorted = [...scores].sort(sortDescendingByScore);
      console.log("🌟🚨 ~ .then ~ highScoresSorted", highScoresSorted);
      return highScoresSorted as HighScore[];
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}
export function saveHighScore(highScore: HighScore): Promise<HighScore[]> {
  return fetch("/api/save_highscore", {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: JSON.stringify(highScore),
  })
    .then((response) => response.json())
    .then((ret) => {
      console.log("🌟🚨 ~ saveHighScore ~ ret", ret);
      return ret;
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}
