import {
  useLoading,
  useAllowedMediaTypes,
  useSetLoading,
  useSetTweets,
  isLoadingFromTwitterApiAtom,
} from "../../providers/store/useSelectors";
import { useConfig } from "../../providers/store/useConfig";
import { SERVER_URL, WAIT_FOR_STREAM_TIMEOUT } from "../../utils/constants";
import { faunaClient } from "providers/faunaProvider";
import { query as q } from "faunadb";
import {
  INITIAL_NUM_TWEETS,
  isTwitterApiUsageExceededAtom,
  serverErrorAtom,
} from "providers/store/store";
import { useAtom } from "jotai";
import { useRef } from "react";
import { uniqBy } from "lodash";
import { Tweet } from "types";

export function useStreamNewTweets() {
  let msUntilRateLimitResetRet = null;
  const [isTwitterApiUsageExceeded, setisTwitterApiUsageExceeded] = useAtom(
    isTwitterApiUsageExceededAtom
  );
  const [, setServerError] = useAtom(serverErrorAtom);

  const { lang, countryCode, numTweets, filterLevel } = useConfig();
  const allowedMediaTypesStrings = useAllowedMediaTypes();
  const loading = useLoading();
  const setLoading = useSetLoading();
  const [, /* isLoadingFromTwitterApi */ setLoadingFromTwitterApi] = useAtom(
    isLoadingFromTwitterApiAtom
  );
  const setTweets = useSetTweets();
  // const addTweets = useAddTweets();

  // const timerRef = useRef(null as number | null);

  const fetchNewTweetsFromTwitterApi = (): Promise<{
    data: Tweet[];
    error: any;
    msUntilRateLimitReset: number | null;
  }> => {
    //   if (isTwitterApiUsageExceeded) {
    //     const timeSinceLastExcession =
    //       Date.now() - isTwitterApiUsageExceeded;
    //   }
    return new Promise(async (resolve, reject) => {
      console.log("🤖... fetching from twitter stream API");
      setLoading(true);
      setLoadingFromTwitterApi(true);

      // set isMonthlyTwitterApiUsageExceeded to true if we don't get a response from stream within 10 seconds,
      // so subsequent requests will come from the DB instead
      // timerRef.current = window.setTimeout(() => {
      //   console.log(
      //     "🤖💣 no response from twitter stream API -- fetching from DB instead"
      //   );
      //   setisTwitterApiUsageExceeded(Date.now());
      //   fetchOldTweetsWithBotScoresFromDB().then((tweetsFromDB) => {
      //     resolve({
      //       ...tweetsFromDB,
      //       msUntilRateLimitReset: msUntilRateLimitResetRet,
      //     });
      //   });
      // }, WAIT_FOR_STREAM_TIMEOUT); // TODO: add linearprogress bar

      const langParam = lang !== "All" ? `&lang=${lang}` : "";
      const allowedMediaParam =
        allowedMediaTypesStrings.length > 0
          ? `&allowedMediaTypes=${allowedMediaTypesStrings.join(",")}`
          : "";
      const countryParam =
        countryCode !== "All" ? `&countryCode=${countryCode}` : "";

      // const locations = geolocation
      //   ? `${geolocation.latitude.left},${geolocation.longitude.left},${geolocation.latitude.right},${geolocation.longitude.right}`
      //   : "";

      const resp = await fetch(
        // geolocation
        // ? `${SERVER_URL}/api/filter?num=${numTweets}&locations=${locations}${allowedMediaParam}`
        // :
        `${SERVER_URL}/api/stream?num=${numTweets}&filterLevel=${filterLevel}${allowedMediaParam}${countryParam}${langParam}`
      );

      const { data, error, msUntilRateLimitReset } = await resp.json();
      if (msUntilRateLimitReset) {
        setisTwitterApiUsageExceeded(Date.now());
      }
      msUntilRateLimitResetRet = msUntilRateLimitReset;
      console.log("🌟 ~ useStreamNewTweets ~ {data,error}", {
        data,
        error,
        msUntilRateLimitReset,
      });

      // const tweetsFromData = data.map((d) => {
      //   const userId = d.user.id_str || d.user.id;
      //   return {
      //     ...d,
      //   };
      // });
      setTweets(data);
      setServerError(
        error || msUntilRateLimitReset
          ? {
              ...error,
              ...(msUntilRateLimitReset ? { msUntilRateLimitReset } : {}),
            }
          : null
      );

      setLoading(false);
      // if (timerRef.current) {
      //   window.clearTimeout(timerRef.current);
      //   timerRef.current = null;
      // }
      console.log("🌟🌟🌟🌟 ~ resolve");

      return resolve({ data, error, msUntilRateLimitReset });
    });
  };

  const fetchOldTweetsWithBotScoresFromDB = async () => {
    setLoading(true);

    const resp = await getAllNodesWithBotScoresFromDB();
    const tweetsWithBotScores =
      (resp as any)?.data?.map((d) => d?.data?.nodeWithBotScore) || [];

    const tweetsWithHiddenBotScores: Tweet[] = tweetsWithBotScores.map((t) => ({
      ...t,
      botScore: undefined,
      hiddenBotScore: t.botScore,
      user: { ...t.user, botScore: undefined, hiddenBotScore: t.botScore },
    }));

    const dedupedTweets = uniqBy(tweetsWithHiddenBotScores, (t) => t.id_str);
    const randomDedupedTweets = shuffle([...dedupedTweets]).slice(
      0,
      INITIAL_NUM_TWEETS
    ) as Tweet[];

    setTweets(randomDedupedTweets);

    setLoading(false);

    return {
      data: randomDedupedTweets,
      error: null,
      msUntilRateLimitReset: msUntilRateLimitResetRet,
    };
  };

  return {
    loading,
    fetchNewTweetsFromDB: fetchOldTweetsWithBotScoresFromDB,
    fetchNewTweetsFromTwitterApi,
  };
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle(array) {
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

export function getAllNodesWithBotScoresFromDB() {
  return faunaClient.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("nodes_with_bot_scores"))),
      q.Lambda((x) => q.Get(x))
    )
  );
}
