import { useSpring } from "react-spring";
import { getRetweetedUser } from "../TweetContent/TweetContent";
import { useIsLight } from "../../providers/ThemeManager";
import { Tweet, User } from "types";
import { MOUSE_WIDTH } from "./NodeTooltip";
import { useAtom } from "jotai";
import { tooltipHistoryAtom } from "providers/store/store";

export function useNodeTooltipContentProps(
  tooltipNode: Tweet | null,
  position: { x: number; y: number }
): {
  springToMousePosition;
  isLight: boolean;
  originalPoster: User;
  tweet: Tweet;
} {
  const [tooltipHistory] = useAtom(tooltipHistoryAtom);
  const lastTooltipNode = tooltipHistory[tooltipHistory.length - 2];

  const springToMousePosition = useSpring({
    pointerEvents: "none",
    position: "fixed",
    opacity: tooltipNode ? 1 : 0,
    top: 16,
    left: MOUSE_WIDTH,
    transform: `translate(${position.x}px,${position.y}px)`,
    config: { tension: 170, mass: 0.1 },
    onRest: () => {
      // if (!tooltipNode) {
      //   lastTooltipNode.current = null;
      // }
    },
  });

  const {
    isLight,
    originalPoster,
    tweet,
  }: { isLight: boolean; originalPoster: User; tweet: Tweet } =
    useNodeTooltipContentPropsLite(tooltipNode, lastTooltipNode);
  return { springToMousePosition, isLight, originalPoster, tweet };
}

export function useNodeTooltipContentPropsLite(
  tooltipNode: Tweet | null,
  lastTooltipNode: any
) {
  const tweet: Tweet = tooltipNode || (lastTooltipNode.current as Tweet);
  const isLight = useIsLight();

  const retweetedUser = getRetweetedUser(tweet);
  const originalPoster = retweetedUser ? retweetedUser : tweet?.user;
  return { isLight, originalPoster, tweet };
}
