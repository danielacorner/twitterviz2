import {
  useFetchTweetsOnMount,
  useFetchQueryTweetsOnMount,
  useStopLoadingEventually,
  useDetectOffline,
} from "./App";

export function AppFunctionalHooks() {
  useFetchTweetsOnMount();
  useFetchQueryTweetsOnMount();
  useStopLoadingEventually();
  useDetectOffline();

  return null;
}
