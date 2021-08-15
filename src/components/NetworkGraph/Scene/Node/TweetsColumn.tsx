import { TooltipContent, TooltipStyles } from "../../NodeTooltip";
import styled from "styled-components/macro";
import { useIsLight } from "providers/ThemeManager";
import { Tweet, User } from "types";
import { UserNode } from "components/NetworkGraph/useUserNodes";

export default function TweetsColumn({
  hasBotScore,
  tweets,
  userNode,
}: {
  hasBotScore: boolean;
  tweets: Tweet[];
  userNode: UserNode | null;
}) {
  const isLight = useIsLight();

  return (
    <TweetsColumnStyles {...{ hasBotScore }}>
      {tweets.map((tweet) => (
        <TooltipStyles
          key={tweet.id_str}
          {...{
            isLight,
            width: 200,
            css: `
                .id_str {display:none;}
      `,
          }}
        >
          <TooltipContent
            {...{
              userNode,
              tweet,
              autoPlay: false,
              compact: false,
            }}
          />
        </TooltipStyles>
      ))}
    </TweetsColumnStyles>
  );
}
const TweetsColumnStyles = styled.div`
  opacity: 0.7;
  position: absolute;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(
    0,
    ${({ hasBotScore }) => (hasBotScore ? 100 : 0)}px,
    0
  );
  top: 216px;
  font-size: 12px;
  color: hsla(0, 0%, 95%, 0.9);
  min-height: 200px;
  display: grid;
  gap: 12px;
`;
