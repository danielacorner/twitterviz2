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
          ? media.video_info?.variants.find(
              ({ content_type }) => content_type === "video/mp4"
            ).url
          : media.media_url_https,
      poster: media.media_url_https,
    })) || []
  );
}
