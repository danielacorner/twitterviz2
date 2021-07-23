import { useIsLight } from "../../providers/ThemeManager";
import { Tweet } from "types";
import { useAtom } from "jotai";
import { tooltipHistoryAtom } from "providers/store/store";
import { getRetweetedUser, useTooltipNode } from "providers/store/useSelectors";

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
