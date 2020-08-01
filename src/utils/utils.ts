export function getMediaArr(
  node
): { src: string; poster?: string; type: string; id_str: string }[] {
  return node.extended_entities?.media.map(getMediaSrc) || [];
}

export function getMediaSrc(
  media
): { src: string; poster?: string; type: string; id_str: string } {
  return media.type === "video"
    ? {
        src: media.video_info?.variants.find(
          ({ content_type }) => content_type === "video/mp4"
        ).url,
        poster: media.media_url_https,
        type: media.type,
        id_str: media.is_str,
      }
    : /* media.type==="image"? */
      { src: media.media_url_https, type: media.type, id_str: media.is_str };
}
