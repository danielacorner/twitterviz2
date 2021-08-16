import { getMediaArr, PADDING } from "../../utils/utils";
import countryCodes from "../../utils/countryCodes";
import LocationIcon from "@material-ui/icons/LocationOnRounded";
import { TweetStyles } from "./TweetStyles";
import { Body2 } from "../common/styledComponents";
import useContainerDimensions from "../../utils/useContainerDimensions";
import MediaContent from "./Media/MediaContent";
import { Place, Tweet, User } from "types";
import { useWindowSize } from "../../utils/hooks";
import TweetUserInfo from "./TweetUserInfo";
import { getRetweetedUser } from "providers/store/useSelectors";

type TweetContentProps = {
  tweet: Tweet;
  offsetY?: number;
  autoPlay?: boolean;
  isTooltip?: boolean;
  isBottomDrawer?: boolean;
  compact: boolean;
};

// tslint:disable-next-line: cognitive-complexity
export default function TweetContent({
  tweet,
  offsetY = 0,
  autoPlay = true,
  isTooltip = false,
  isBottomDrawer = false,
  compact,
}: TweetContentProps) {
  const {
    user,
    text,
    retweeted_status,
    extended_tweet,
    extended_entities,
    place,
    in_reply_to_screen_name,
  } = tweet;
  const { height: windowHeight } = useWindowSize();
  const retweetedUser = getRetweetedUser(tweet);

  const mediaArr = getMediaArr(tweet);

  const fullText =
    extended_tweet?.full_text ||
    retweeted_status?.extended_tweet?.full_text ||
    retweeted_status?.text ||
    text;

  const textWithLinks = fullText ? addLinksToText(fullText) : "";

  const [ref, dimensions] = useContainerDimensions();
  // const searchObj = useSearchObj();
  const { firstItemWidth, totalHeight } = mediaArr.reduce(
    (acc, media, idx) => ({
      totalHeight: media.sizes.large.h + acc.totalHeight,
      firstItemWidth:
        (idx === 0 ? media.sizes.large.w : 0) + acc.firstItemWidth,
    }),
    { firstItemWidth: 0, totalHeight: 0 }
  );

  const isCompactGrid = compact && mediaArr.length > 1;

  return (
    <TweetStyles
      className={isBottomDrawer ? "bottomDrawerTweetStyles" : ""}
      ref={ref}
      compact={isCompactGrid}
      // isGallery={`${TAB_INDICES.GALLERY}` in searchObj}
      isRetweet={Boolean(retweetedUser)}
      isTooltip={isTooltip}
      isBottomDrawer={isBottomDrawer}
      videoHeight={Math.min(windowHeight, -offsetY + 270)}
      isVideo={extended_entities?.media[0]?.type === "video"}
      mediaHeight={totalHeight}
      mediaWidth={firstItemWidth}
    >
      <TweetUserInfo
        {...{
          retweetedUser,
          user,
          isTooltip,
          in_reply_to_screen_name,
        }}
      />
      {(user?.location || place?.country_code) && (
        <LocationInfo {...{ user, place }} />
      )}
      <Body2 className="text">{textWithLinks}</Body2>
      {mediaArr.length > 0 && (
        <div className="allMedia">
          {mediaArr.map((mediaItem) => {
            return (
              <MediaContent
                key={mediaItem.id_str}
                {...mediaItem}
                {...{
                  autoPlay,
                  isTooltip,
                  isBottomDrawer,
                  numImages: mediaArr.length,
                  ...(isCompactGrid
                    ? {
                        containerWidth:
                          (dimensions?.width || 0) * 0.5 - PADDING / 2,
                        containerHeight:
                          (dimensions?.height || 0) * 0.5 - PADDING / 2,
                      }
                    : {
                        containerWidth: dimensions?.width || 0,
                        containerHeight: dimensions?.height || 0,
                      }),
                  ...(isCompactGrid && mediaArr.length > 2
                    ? { maxHeight: dimensions?.width * 0.5 }
                    : {}),
                }}
              />
            );
          })}
        </div>
      )}
    </TweetStyles>
  );
}

function LocationInfo({ user, place }: { user: User; place: Place | null }) {
  return (
    <div className="locationInfo">
      {user.location && (
        <>
          <LocationIcon />
          {user.location}
        </>
      )}
      {place?.country_code && (
        <div className="country">| {countryCodes[place?.country_code]}</div>
      )}
    </div>
  );
}

// tslint:disable-next-line
function addLinksToText(fullText: string) {
  return (
    fullText
      .split(" ")
      // if first two are "RT: someUser", store separately
      .reduce((acc, cur, idx, array) => {
        const prev = array[idx - 1];

        if (cur === "RT") {
          return acc;
        } else if (prev === "RT") {
          return acc;
        } else {
          return [...acc, cur];
        }
      }, [] as string[])
      .map((word, idx) =>
        word[0] === "@" ? (
          <a
            style={{ marginRight: "0.5ch" }}
            key={idx}
            href={`https://twitter.com/${
              word.slice(-1) === ":" ? word.slice(1, -1) : word.slice(1)
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {word}
          </a>
        ) : word[0] === "#" ? (
          <a
            style={{ marginRight: "0.5ch" }}
            key={idx}
            href={`https://twitter.com/hashtag/${word.slice(1)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {word}
          </a>
        ) : word.includes("https://t.co/") ? (
          ""
        ) : word.slice(0, 5) === "https" ? (
          <a
            style={{ marginRight: "0.5ch" }}
            key={idx}
            href={word}
            target="_blank"
            rel="noopener noreferrer"
          >
            {word}
          </a>
        ) : (
          word + " "
        )
      )
  );
}
