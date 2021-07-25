// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
// https://github.com/Hermanya/use-interval/blob/master/src/index.tsx
// * not set up to work with delay = 0

import { useRef, useEffect } from "react";

/**
 * a dynamic setInterval
 *
 * @param callback function to call on the interval
 * @param delay milliseconds between each call
 * @param immediate should call the callback right away?
 */
export const useInterval = ({
  callback,
  delay,
  immediate = false /* called when mounted if true */,
}: {
  callback: () => void;
  delay: number | null | false;
  immediate: boolean;
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const savedCallback = useRef(null as Function | null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
    return () => {
      savedCallback.current = null;
    };
  }, [callback]);

  // Execute callback if immediate is set & delay exists.
  const firstDelayRef = useRef(delay);
  useEffect(() => {
    if (immediate && firstDelayRef.current && savedCallback.current) {
      savedCallback.current();
    }
  }, [immediate]);

  // Set up the interval.
  useEffect(() => {
    if (!delay) {
      return undefined;
    }

    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    let intervalId;

    if (delay !== null) {
      intervalId = setInterval(tick, delay);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [delay]);
};
