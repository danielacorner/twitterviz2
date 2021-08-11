import { faunaClient } from "providers/faunaProvider";
import { query as q } from "faunadb";
import { sortDescendingByScore } from "./sortDescendingByScore";
// import { SERVER_URL } from "utils/constants";

export function useDeleteAllHighScores() {
  return () =>
    faunaClient.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("player_scores"))),
        q.Lambda((x) => q.Delete(x))
      )
    );
}
export type HighScoreType = {
  userId: string;
  name: string;
  isNewHighScore?: boolean;
  score: number;
};
export function fetchAllHighScoresSorted(): Promise<HighScoreType[]> {
  // get all documents https://stackoverflow.com/questions/61488323/how-to-get-all-documents-from-a-collection-in-faunadb
  return faunaClient
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("player_scores"))),
        q.Lambda((x) => q.Get(x))
      )
    )
    .then((ret) => {
      const scores = (ret as any).data?.map((d) => d.data) || [];
      const highScoresSorted = [...scores].sort(sortDescendingByScore);
      return highScoresSorted as HighScoreType[];
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}
export function saveHighScore(highScore: HighScoreType): Promise<void> {
  const { userId, name, score } = highScore;
  return new Promise((resolve, reject) => {
    faunaClient
      .query(
        q.Create(q.Collection("player_scores"), {
          data: { userId, name, score },
        })
      )
      .then((ret) => {
        resolve();
        return ret;
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });

  // return fetch(`${SERVER_URL}/api/save_highscore`, {
  //   headers: { "content-type": "application/json" },
  //   method: "POST",
  //   body: JSON.stringify(highScore),
  // })
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((ret) => {
  //     return ret;
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     return [];
  //   });
}
