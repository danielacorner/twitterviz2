import { useEffect } from "react";
import { useConfig } from "../providers/store";
import { Variant } from "../types";
import { geoDistanceKm } from "./distanceFromCoords";

export const PADDING = 6;

export type MediaItem = {
  variants: Variant[];
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

export function getMediaArr(tweet: any): MediaItem[] {
  return (
    tweet.extended_entities?.media.map((media) => ({
      ...media,
      variants: media.video_info?.variants.filter(
        ({ content_type }) => content_type === "video/mp4"
      ),
      src:
        media?.type === "video"
          ? media.video_info?.variants.filter(
              ({ content_type }) => content_type === "video/mp4"
            )
          : media.media_url_https,
      poster: media.media_url_https,
    })) || []
  );
}

export function useMount(cb) {
  return useEffect(cb, []);
}

export function useParamsForFetch() {
  const { lang, allowedMediaTypes, countryCode, geolocation } = useConfig();
  const langParam = lang !== "All" ? `&lang=${lang}` : "";
  const allowedMediaTypesParam = !allowedMediaTypes.all
    ? `&allowedMediaTypes=${allowedMediaTypes}`
    : "";
  const countryParam =
    countryCode !== "All" ? `&countryCode=${countryCode}` : "";
  // https://developer.twitter.com/en/docs/twitter-api/v1/tweets/search/api-reference/get-search-tweets
  const searchRadius = geolocation
    ? geoDistanceKm(
        geolocation.latitude.left,
        geolocation.longitude.left,
        geolocation.latitude.right,
        geolocation.longitude.left
      ) / 2
    : "";
  const geocodeParam = geolocation
    ? `&geocode=${
        (geolocation.latitude.left + geolocation.latitude.right) / 2
      },${
        (geolocation.longitude.left + geolocation.longitude.right) / 2
      },${searchRadius}km`
    : "";
  return { langParam, allowedMediaTypesParam, countryParam, geocodeParam };
}
