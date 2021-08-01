import { useState } from "react";
import { useInterval } from "utils/useInterval";

const SECONDS_IN_DAY = 24 * 60 * 60;
const TURBIDITY = { max: -50, min: 100 };

export function useTurbidityByTimeOfDay() {
  const date = new Date();
  const [hours, minutes, seconds] = [
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  const secondOfDay = (hours * 60 + minutes) * 60 + seconds;
  // maximum = 12pm --> brightness = time before or after 12pm
  const secondsAtNoon = SECONDS_IN_DAY / 2;
  const secondsBeforeOrSinceNoon = Math.abs(secondOfDay - secondsAtNoon);
  const brightnessPct =
    (SECONDS_IN_DAY - secondsBeforeOrSinceNoon) / SECONDS_IN_DAY;

  const [turbidity, setTurbidity] = useState(
    TURBIDITY.min + brightnessPct * (TURBIDITY.max - TURBIDITY.min)
  );

  // update every 5min
  useInterval({
    callback: () => {
      setTurbidity(
        TURBIDITY.min + brightnessPct * (TURBIDITY.max - TURBIDITY.min)
      );
    },
    delay: 5 * 60 * 1000,
    immediate: false,
  });

  return turbidity;
}
