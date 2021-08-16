import { useMount } from "utils/utils";
import { useConfig } from "../providers/store/useConfig";
import { useFetchTweetsOnMount } from "../providers/faunaProvider";

export default function AppFunctionalHooks() {
  useFetchTweetsOnMount();
  // useStopLoadingEventually();
  useDetectOffline();

  return null;
}

function useDetectOffline() {
  const { setConfig } = useConfig();
  useMount(() => {
    window.addEventListener("offline", () => {
      setConfig({ isOffline: true });
    });
  });
}

// const MAX_LOADING_TIME = 2 * 1000;

/** stop loading after MAX_LOADING_TIME */
// function useStopLoadingEventually() {
//   const loading = useLoading();
//   const setLoading = useSetLoading();
//   const tweets = useTweets();
//   const prevTweets = useRef(tweets);

//   // when loading starts, start a timer to stop loading
//   useEffect(() => {
//     const timer = window.setTimeout(() => {
//       setLoading(false);
//     }, MAX_LOADING_TIME);

//     return () => {
//       clearTimeout(timer);
//     };
//   }, [loading, setLoading, tweets]);

//   // when tweets length changes, stop loading
//   useEffect(() => {
//     if (prevTweets.current.length !== tweets.length) {
//       setLoading(false);
//       const app = document.querySelector(".App");
//       if (!app) {
//         return;
//       }
//       (app as HTMLElement).style.cursor = "unset";
//     }
//   }, [tweets, setLoading]);
// }
