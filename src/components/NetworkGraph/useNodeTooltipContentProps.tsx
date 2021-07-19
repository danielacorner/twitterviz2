import { useSpring } from "react-spring";
import { useIsLight } from "../../providers/ThemeManager";
import { Tweet, User } from "types";
import { MOUSE_WIDTH } from "./NodeTooltip";
import { useAtom } from "jotai";
import { isPointerOverAtom, tooltipHistoryAtom } from "providers/store/store";
import { getRetweetedUser, useTooltipNode } from "providers/store/useSelectors";

export function useNodeTooltipContentProps(position: {
  x: number;
  y: number;
}): {
  springToMousePosition;
  isLight: boolean;
  originalPoster: User;
  tweet: Tweet;
} {
  const tooltipNode = useTooltipNode();
  const [isPointerOver] = useAtom(isPointerOverAtom);

  const springToMousePosition = useSpring({
    pointerEvents: "none",
    position: "fixed",
    opacity: tooltipNode ? (isPointerOver ? 1 : 0.2) : 0,
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
    useNodeTooltipContentPropsLite();
  return { springToMousePosition, isLight, originalPoster, tweet };
}

export function useNodeTooltipContentPropsLite() {
  const tooltipNode = useTooltipNode();
  const [tooltipHistory] = useAtom(tooltipHistoryAtom);
  const lastTooltipNode = tooltipHistory[tooltipHistory.length - 2];
  const tweet: Tweet = tooltipNode || (lastTooltipNode as Tweet);
  const isLight = useIsLight();

  const retweetedUser = getRetweetedUser(tweet);
  const originalPoster = retweetedUser ? retweetedUser : tweet?.user;
  return { isLight, originalPoster, tweet };
}
