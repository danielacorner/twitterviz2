import shallow from "zustand/shallow";
import useStore from "./store";

/** return all configurable values from the control panel
 * * the convenience of a big object useConfig() is offset by the consequence of
 * * causing re-renders on each component using it, every time any config value changes
 */

export const useConfig = () => {
  // ? is it possible to return factory functions which generate these selectors instead?
  // ? e.g.
  // ? return { getLoading: () => useStore(state...
  // ? const {getLoading} = useConfig(); const loading = getLoading())
  return {
    isStorybook: window.location.href.includes("localhost:6006"),
    // useLoading: ()=> useStore((state) => (state).loading, shallow),
    is3d: useStore((state) => state.config.is3d, shallow),
    gravity: useStore((state) => state.config.gravity, shallow),
    charge: useStore((state) => state.config.charge, shallow),
    isPaused: useStore((state) => state.config.isPaused, shallow),
    d3VelocityDecay: useStore((state) => state.config.d3VelocityDecay, shallow),
    d3AlphaDecay: useStore((state) => state.config.d3AlphaDecay, shallow),
    cooldownTime: useStore((state) => state.config.cooldownTime, shallow),
    isGridMode: useStore((state) => state.config.isGridMode, shallow),
    showUserNodes: useStore((state) => state.config.showUserNodes, shallow),
    colorBy: useStore((state) => state.config.colorBy, shallow),
    lang: useStore((state) => state.config.lang, shallow),
    countryCode: useStore((state) => state.config.countryCode, shallow),
    geolocation: useStore((state) => state.config.geolocation, shallow),
    resultType: useStore((state) => state.config.resultType, shallow),
    allowedMediaTypes: useStore(
      (state) => state.config.allowedMediaTypes,
      shallow
    ),
    replace: useStore((state) => state.config.replace, shallow),
    filterLevel: useStore((state) => state.config.filterLevel, shallow),
    searchTerm: useStore((state) => state.config.searchTerm, shallow),
    numTweets: useStore((state) => state.config.numTweets, shallow),
    isOffline: useStore((state) => state.config.isOffline, shallow),
    setConfig: useStore((state) => state.setConfig, shallow),
  };
};
