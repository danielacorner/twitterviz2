import {
  useLoading,
  useAllowedMediaTypes,
  useSetLoading,
  useSetTweets,
} from "../../providers/store/useSelectors";
import { useConfig } from "../../providers/store/useConfig";
import { SERVER_URL } from "../../utils/constants";
import { faunaClient } from "providers/faunaProvider";
import { query as q } from "faunadb";
import { INITIAL_NUM_TWEETS } from "providers/store/store";

const isMonthlyTwitterApiUsageExceeded = false;

export function useStreamNewTweets() {
  const { lang, countryCode, numTweets, filterLevel, geolocation } =
    useConfig();
  const allowedMediaTypesStrings = useAllowedMediaTypes();
  const loading = useLoading();
  const setLoading = useSetLoading();
  const setTweets = useSetTweets();
  // const addTweets = useAddTweets();

  const fetchNewTweetsFromTwitterApi = async () => {
    setLoading(true);

    const langParam = lang !== "All" ? `&lang=${lang}` : "";
    const allowedMediaParam =
      allowedMediaTypesStrings.length > 0
        ? `&allowedMediaTypes=${allowedMediaTypesStrings.join(",")}`
        : "";
    const countryParam =
      countryCode !== "All" ? `&countryCode=${countryCode}` : "";

    const locations = geolocation
      ? `${geolocation.latitude.left},${geolocation.longitude.left},${geolocation.latitude.right},${geolocation.longitude.right}`
      : "";

    const resp = await fetch(
      geolocation
        ? `${SERVER_URL}/api/filter?num=${numTweets}&locations=${locations}${allowedMediaParam}`
        : `${SERVER_URL}/api/stream?num=${numTweets}&filterLevel=${filterLevel}${allowedMediaParam}${countryParam}${langParam}`
    );

    const data = await resp.json();

    setTweets(data);

    setLoading(false);

    return data;
  };

  const fetchOldTweetsWithBotScoresFromDB = async () => {
    setLoading(true);

    const resp = await faunaClient.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("nodes_with_bot_scores"))),
        q.Lambda((x) => q.Get(x))
      )
    );
    const tweetsWithBotScores =
      (resp as any)?.data?.map((d) => d?.data?.nodeWithBotScore) || [];
    const tweetsWithHiddenBotScores = tweetsWithBotScores.map((t) => ({
      ...t,
      botScore: undefined,
      hiddenBotScore: t.botScore,
      user: { ...t.user, botScore: undefined, hiddenBotScore: t.botScore },
    }));

    const randomTweets = shuffle([...tweetsWithHiddenBotScores]).slice(
      0,
      INITIAL_NUM_TWEETS
    );

    setTweets(randomTweets);

    setLoading(false);

    // return data;
  };
  return {
    loading,
    fetchNewTweets: isMonthlyTwitterApiUsageExceeded
      ? fetchOldTweetsWithBotScoresFromDB
      : fetchNewTweetsFromTwitterApi,
  };
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
