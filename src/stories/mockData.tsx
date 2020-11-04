import mockTweetsData from "../mockTweetsData.json";

export const mockTweetWithMedia = {
  created_at: "Sat Oct 17 02:06:10 +0000 2020",
  id: 1317285747318169600,
  id_str: "1317285747318169600",
  text: "https://t.co/DZpnte42vi",
  truncated: false,
  entities: {
    hashtags: [],
    symbols: [],
    user_mentions: [],
    urls: [],
    media: [
      {
        id: 1317260183911977000,
        id_str: "1317260183911976966",
        indices: [0, 23],
        media_url:
          "http://pbs.twimg.com/amplify_video_thumb/1317260183911976966/img/bQmra2kx02f-wKhW.jpg",
        media_url_https:
          "https://pbs.twimg.com/amplify_video_thumb/1317260183911976966/img/bQmra2kx02f-wKhW.jpg",
        url: "https://t.co/DZpnte42vi",
        display_url: "pic.twitter.com/DZpnte42vi",
        expanded_url:
          "https://twitter.com/TeamTrump/status/1317260301855838211/video/1",
        type: "photo",
        sizes: {
          thumb: {
            w: 150,
            h: 150,
            resize: "crop",
          },
          medium: {
            w: 1200,
            h: 675,
            resize: "fit",
          },
          small: {
            w: 680,
            h: 383,
            resize: "fit",
          },
          large: {
            w: 1280,
            h: 720,
            resize: "fit",
          },
        },
        source_status_id: 1317260301855838200,
        source_status_id_str: "1317260301855838211",
        source_user_id: 729676086632656900,
        source_user_id_str: "729676086632656900",
      },
    ],
  },
  extended_entities: {
    media: [
      {
        id: 1317260183911977000,
        id_str: "1317260183911976966",
        indices: [0, 23],
        media_url:
          "http://pbs.twimg.com/amplify_video_thumb/1317260183911976966/img/bQmra2kx02f-wKhW.jpg",
        media_url_https:
          "https://pbs.twimg.com/amplify_video_thumb/1317260183911976966/img/bQmra2kx02f-wKhW.jpg",
        url: "https://t.co/DZpnte42vi",
        display_url: "pic.twitter.com/DZpnte42vi",
        expanded_url:
          "https://twitter.com/TeamTrump/status/1317260301855838211/video/1",
        type: "video",
        sizes: {
          thumb: {
            w: 150,
            h: 150,
            resize: "crop",
          },
          medium: {
            w: 1200,
            h: 675,
            resize: "fit",
          },
          small: {
            w: 680,
            h: 383,
            resize: "fit",
          },
          large: {
            w: 1280,
            h: 720,
            resize: "fit",
          },
        },
        source_status_id: 1317260301855838200,
        source_status_id_str: "1317260301855838211",
        source_user_id: 729676086632656900,
        source_user_id_str: "729676086632656900",
        video_info: {
          aspect_ratio: [16, 9],
          duration_millis: 43534,
          variants: [
            {
              bitrate: 2176000,
              content_type: "video/mp4",
              url:
                "https://video.twimg.com/amplify_video/1317260183911976966/vid/1280x720/7ia46jXx6fbbjQsD.mp4?tag=13",
            },
            {
              content_type: "application/x-mpegURL",
              url:
                "https://video.twimg.com/amplify_video/1317260183911976966/pl/DKr32ybSHFYbG64K.m3u8?tag=13",
            },
            {
              bitrate: 288000,
              content_type: "video/mp4",
              url:
                "https://video.twimg.com/amplify_video/1317260183911976966/vid/480x270/nsZsAhCMNVDega4I.mp4?tag=13",
            },
            {
              bitrate: 832000,
              content_type: "video/mp4",
              url:
                "https://video.twimg.com/amplify_video/1317260183911976966/vid/640x360/K85xf-ICSPqB3YKA.mp4?tag=13",
            },
          ],
        },
        additional_media_info: {
          title: "",
          description: "",
          embeddable: true,
          monetizable: false,
          source_user: {
            id: 729676086632656900,
            id_str: "729676086632656900",
            name: "Team Trump (Text VOTE to 88022)",
            screen_name: "TeamTrump",
            location: "USA",
            description:
              "The official Twitter account for the Trump Campaign. Together, we will MAKE AMERICA GREAT AGAIN! 🇺🇸",
            url: "https://t.co/mZB2hymxC9",
            entities: {
              url: {
                urls: [
                  {
                    url: "https://t.co/mZB2hymxC9",
                    expanded_url: "http://www.DonaldJTrump.com",
                    display_url: "DonaldJTrump.com",
                    indices: [0, 23],
                  },
                ],
              },
              description: {
                urls: [],
              },
            },
            protected: false,
            followers_count: 2292749,
            friends_count: 130,
            listed_count: 4484,
            created_at: "Mon May 09 14:15:10 +0000 2016",
            favourites_count: 3518,
            utc_offset: null,
            time_zone: null,
            geo_enabled: true,
            verified: true,
            statuses_count: 28333,
            lang: null,
            contributors_enabled: false,
            is_translator: false,
            is_translation_enabled: false,
            profile_background_color: "000000",
            profile_background_image_url:
              "http://abs.twimg.com/images/themes/theme1/bg.png",
            profile_background_image_url_https:
              "https://abs.twimg.com/images/themes/theme1/bg.png",
            profile_background_tile: false,
            profile_image_url:
              "http://pbs.twimg.com/profile_images/745768799849308160/KrZhjkpH_normal.jpg",
            profile_image_url_https:
              "https://pbs.twimg.com/profile_images/745768799849308160/KrZhjkpH_normal.jpg",
            profile_banner_url:
              "https://pbs.twimg.com/profile_banners/729676086632656900/1588979102",
            profile_link_color: "CB0606",
            profile_sidebar_border_color: "000000",
            profile_sidebar_fill_color: "000000",
            profile_text_color: "000000",
            profile_use_background_image: false,
            has_extended_profile: false,
            default_profile: false,
            default_profile_image: false,
            following: false,
            follow_request_sent: false,
            notifications: false,
            translator_type: "none",
          },
        },
      },
    ],
  },
  source:
    '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>',
  in_reply_to_status_id: null,
  in_reply_to_status_id_str: null,
  in_reply_to_user_id: null,
  in_reply_to_user_id_str: null,
  in_reply_to_screen_name: null,
  user: {
    id: 25073877,
    id_str: "25073877",
    name: "Donald J. Trump",
    screen_name: "realDonaldTrump",
    location: "Washington, DC",
    description: "45th President of the United States of America🇺🇸",
    url: "https://t.co/OMxB0x7xC5",
    entities: {
      url: {
        urls: [
          {
            url: "https://t.co/OMxB0x7xC5",
            expanded_url: "http://www.Instagram.com/realDonaldTrump",
            display_url: "Instagram.com/realDonaldTrump",
            indices: [0, 23],
          },
        ],
      },
      description: {
        urls: [],
      },
    },
    protected: false,
    followers_count: 87277211,
    friends_count: 50,
    listed_count: 121456,
    created_at: "Wed Mar 18 13:46:38 +0000 2009",
    favourites_count: 5,
    utc_offset: null,
    time_zone: null,
    geo_enabled: true,
    verified: true,
    statuses_count: 57261,
    lang: null,
    contributors_enabled: false,
    is_translator: false,
    is_translation_enabled: true,
    profile_background_color: "6D5C18",
    profile_background_image_url:
      "http://abs.twimg.com/images/themes/theme1/bg.png",
    profile_background_image_url_https:
      "https://abs.twimg.com/images/themes/theme1/bg.png",
    profile_background_tile: true,
    profile_image_url:
      "http://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_normal.jpg",
    profile_image_url_https:
      "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_normal.jpg",
    profile_banner_url:
      "https://pbs.twimg.com/profile_banners/25073877/1600830803",
    profile_link_color: "1B95E0",
    profile_sidebar_border_color: "BDDCAD",
    profile_sidebar_fill_color: "C5CEC0",
    profile_text_color: "333333",
    profile_use_background_image: true,
    has_extended_profile: false,
    default_profile: false,
    default_profile_image: false,
    following: false,
    follow_request_sent: false,
    notifications: false,
    translator_type: "regular",
  },
  geo: null,
  coordinates: null,
  place: null,
  contributors: null,
  is_quote_status: false,
  retweet_count: 624,
  favorite_count: 1940,
  favorited: false,
  retweeted: false,
  possibly_sensitive: false,
  possibly_sensitive_appealable: false,
  lang: "und",
};

export const mockTweetWithImage = mockTweetsData[1];

export const mockTweets = mockTweetsData;
