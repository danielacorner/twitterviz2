import { useIsLight } from "../../providers/ThemeManager";
import { Tweet } from "types";
import { useAtom } from "jotai";
import { tooltipHistoryAtom } from "providers/store/store";
import { useTooltipNode } from "providers/store/useSelectors";

export function useNodeTooltipContentPropsLite() {
  const tooltipNode = useTooltipNode();
  const [tooltipHistory] = useAtom(tooltipHistoryAtom);
  const lastTooltipNode = tooltipHistory[tooltipHistory.length - 2];
  const tweet: Tweet = tooltipNode || (lastTooltipNode as Tweet);
  const isLight = useIsLight();

  return { isLight, tweet };
}
