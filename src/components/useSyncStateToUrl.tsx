import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { TAB_INDICES, useTweets } from "../providers/store";
import qs from "query-string";

/** when the tweets change, update the url */
export default function useSyncStateToUrl(): [
  number,
  React.Dispatch<React.SetStateAction<number>>
] {
  const [tabIndex, setTabIndex] = useState(TAB_INDICES.NETWORKGRAPH);

  const tweets = useTweets();
  const history = useHistory();
  const { pathname, search } = useLocation();

  // TODO: not working when fetch tweets by id?
  useEffect(() => {
    const queryObj = qs.parse(search);
    const newQueryObj = {
      ...queryObj,
      tab: tabIndex,
      tweets: tweets.map((t) => t.id_str).join(","),
    };

    const newSearch = qs.stringify(newQueryObj);
    const newPath = `${pathname}?${newSearch}`;

    if (newPath !== pathname) {
      history.push(newPath);
    }
  }, [pathname, history, tweets, tabIndex, search]);
  return [tabIndex, setTabIndex];
}
