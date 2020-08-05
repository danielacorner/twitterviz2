export const PADDING = 8;

export type MediaItem = {
  src: string;
  poster?: string;
  type: string;
  id_str: string;
  sizes: {
    large: { w: number; h: number; resize: string };
    medium: { w: number; h: number; resize: string };
    small: { w: number; h: number; resize: string };
    thumb: { w: number; h: number; resize: string };
  };
};

export function getMediaArr(node): MediaItem[] {
  return (
    node.extended_entities?.media.map((media) => ({
      ...media,
      src:
        media.type === "video"
          ? media.video_info?.variants
              .filter(({ content_type }) => content_type === "video/mp4")
              .reduce((acc, cur) => {
                // return biggest bitrate
                if (!acc && cur.bitrate) {
                  return cur;
                } else if (cur.bitrate && cur.bitrate > acc.bitrate) {
                  return cur;
                } else {
                  return acc;
                }
              }, null).url
          : media.media_url_https,
      poster: media.media_url_https,
    })) || []
  );
}
