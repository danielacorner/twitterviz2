// tslint:disable
import mockTweetsData from "./mockTweetsData.json";
import mockTweetWithVideoJSON from "./mockTweetWithVideo.json";
export const mockTweetWithImage = mockTweetsData[2];
export const mockTweetWithVideo = mockTweetWithVideoJSON;

export const mockTweetWithSubtweet = {
  created_at: "Wed Nov 04 03:23:02 +0000 2020",
  id: 1323828070382510000,
  id_str: "1323828070382510080",
  text:
    "@realDonaldTrump @VideoEditBot mute, earrape, speed=2, music= https://t.co/ZEobXxWhtu",
  truncated: false,
  entities: {
    hashtags: [],
    symbols: [],
    user_mentions: [
      {
        screen_name: "realDonaldTrump",
        name: "Donald J. Trump",
        id: 25073877,
        id_str: "25073877",
        indices: [0, 16],
      },
      {
        screen_name: "VideoEditBot",
        name: "VideoEditBot (videoedit.bot if no reply!)",
        id: 1277471663987327000,
        id_str: "1277471663987326976",
        indices: [17, 30],
      },
    ],
    urls: [
      {
        url: "https://t.co/ZEobXxWhtu",
        expanded_url: "https://youtu.be/Q3usjM661sE",
        display_url: "youtu.be/Q3usjM661sE",
        indices: [62, 85],
      },
    ],
  },
  metadata: {
    iso_language_code: "en",
    result_type: "recent",
  },
  source:
    '<a href="http://twitter.com/download/android" rel="nofollow">Twitter for Android</a>',
  in_reply_to_status_id: 1323534663453913000,
  in_reply_to_status_id_str: "1323534663453913093",
  in_reply_to_user_id: 25073877,
  in_reply_to_user_id_str: "25073877",
  in_reply_to_screen_name: "realDonaldTrump",
  user: {
    id: 1004729258298789900,
    id_str: "1004729258298789888",
    name: "Tidmouth sheds productions",
    screen_name: "Sebasti62190104",
    location: "Rancagua, Chile",
    description:
      "I like thomas the tank engine and trains in general, (warning,nsfw may appear along the line so procede with caution🔞)",
    url: "https://t.co/uirOYMIlxR",
    entities: {
      url: {
        urls: [
          {
            url: "https://t.co/uirOYMIlxR",
            expanded_url:
              "https://www.youtube.com/channel/UCdzZery7AWT9kDFyrAcnUfg",
            display_url: "youtube.com/channel/UCdzZe…",
            indices: [0, 23],
          },
        ],
      },
      description: {
        urls: [],
      },
    },
    protected: false,
    followers_count: 222,
    friends_count: 486,
    listed_count: 0,
    created_at: "Thu Jun 07 14:18:16 +0000 2018",
    favourites_count: 2672,
    utc_offset: null,
    time_zone: null,
    geo_enabled: true,
    verified: false,
    statuses_count: 4008,
    lang: null,
    contributors_enabled: false,
    is_translator: false,
    is_translation_enabled: false,
    profile_background_color: "F5F8FA",
    profile_background_image_url: null,
    profile_background_image_url_https: null,
    profile_background_tile: false,
    profile_image_url:
      "http://pbs.twimg.com/profile_images/1311094127753396224/XxLIOKeg_normal.jpg",
    profile_image_url_https:
      "https://pbs.twimg.com/profile_images/1311094127753396224/XxLIOKeg_normal.jpg",
    profile_banner_url:
      "https://pbs.twimg.com/profile_banners/1004729258298789888/1593144568",
    profile_link_color: "1DA1F2",
    profile_sidebar_border_color: "C0DEED",
    profile_sidebar_fill_color: "DDEEF6",
    profile_text_color: "333333",
    profile_use_background_image: true,
    has_extended_profile: true,
    default_profile: true,
    default_profile_image: false,
    following: false,
    follow_request_sent: false,
    notifications: false,
    translator_type: "none",
  },
  geo: null,
  coordinates: null,
  place: null,
  contributors: null,
  is_quote_status: false,
  retweet_count: 0,
  favorite_count: 0,
  favorited: false,
  retweeted: false,
  possibly_sensitive: false,
  lang: "en",
  __indexColor: "#340017",
  index: 7,
  x: 11.40687618035345,
  y: 121.39569325941477,
  vx: -0.19384587633495493,
  vy: 0.05685339412221595,
};
export const mockTweetWithSubtweetImage = mockTweetWithSubtweet;
export const mockTweetWithSubtweetVideo = mockTweetWithSubtweet;
export const mockTweets = mockTweetsData;
