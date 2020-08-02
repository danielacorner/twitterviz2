export type Tweet = {
  created_at: string;
  id: number;
  id_str: string;
  text: string;
  display_text_range: [number, number];
  source: string;
  truncated: true;
  in_reply_to_status_id: null;
  in_reply_to_status_id_str: null;
  in_reply_to_user_id: null;
  in_reply_to_user_id_str: null;
  in_reply_to_screen_name: null;
  user: {
    id: number;
    id_str: string;
    name: string;
    screen_name: string;
    location: string;
    url: null;
    description: string;
    translator_type: string;
    protected: false;
    verified: false;
    followers_count: number;
    friends_count: number;
    listed_count: number;
    favourites_count: number;
    statuses_count: number;
    created_at: string;
    utc_offset: null;
    time_zone: null;
    geo_enabled: true;
    lang: null;
    contributors_enabled: false;
    is_translator: false;
    profile_background_color: string;
    profile_background_image_url: string;
    profile_background_image_url_https: string;
    profile_background_tile: false;
    profile_link_color: string;
    profile_sidebar_border_color: string;
    profile_sidebar_fill_color: string;
    profile_text_color: string;
    profile_use_background_image: true;
    profile_image_url: string;
    profile_image_url_https: string;
    profile_banner_url: string;
    default_profile: true;
    default_profile_image: false;
    following: null;
    follow_request_sent: null;
    notifications: null;
  };
  geo: null;
  coordinates: null;
  place: null;
  contributors: null;
  is_quote_status: false;
  extended_tweet: {
    full_text: string;
    display_text_range: [number, number];
    entities: {
      hashtags: any[];
      urls: any[];
      user_mentions: any[];
      symbols: any[];
      media: [
        {
          id: number;
          id_str: string;
          indices: [number, number];
          media_url: string;
          media_url_https: string;
          url: string;
          display_url: string;
          expanded_url: string;
          type: string;
          sizes: {
            thumb: { w: number; h: number; resize: string };
            small: { w: number; h: number; resize: string };
            large: { w: number; h: number; resize: string };
            medium: { w: number; h: number; resize: string };
          };
        }
      ];
    };
    extended_entities: {
      media: [
        {
          id: number;
          id_str: string;
          indices: [number, number];
          media_url: string;
          media_url_https: string;
          url: string;
          display_url: string;
          expanded_url: string;
          type: string;
          sizes: {
            thumb: { w: number; h: number; resize: string };
            small: { w: number; h: number; resize: string };
            large: { w: number; h: number; resize: string };
            medium: { w: number; h: number; resize: string };
          };
        }
      ];
    };
  };
  quote_count: number;
  reply_count: number;
  retweet_count: number;
  favorite_count: number;
  entities: {
    hashtags: any[];
    urls: [
      {
        url: string;
        expanded_url: string;
        display_url: string;
        indices: [number, number];
      }
    ];
    user_mentions: any[];
    symbols: any[];
  };
  favorited: false;
  retweeted: false;
  possibly_sensitive: false;
  filter_level: string;
  lang: string;
  timestamp_ms: string;
};
