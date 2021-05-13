import React from "react";
import {
  useSetTweets,
  useLoading,
  useAllowedMediaTypes,
  useSetLoading,
} from "../../../providers/store/useSelectors";
import { useConfig } from "../../../providers/store/useConfig";
import DiceIcon from "@material-ui/icons/Casino";
import { SERVER_URL } from "../../../utils/constants";
import { StyledButton } from "./StyledButton";
import { RowDiv } from "components/common/styledComponents";

export function BtnStreamNewTweets() {
  const { lang, countryCode, numTweets, filterLevel, geolocation } =
    useConfig();
  const allowedMediaTypesStrings = useAllowedMediaTypes();
  const loading = useLoading();
  const setLoading = useSetLoading();
  const setTweets = useSetTweets();

  const fetchNewTweets = async () => {
    setLoading(true);

    const langParam = lang !== "All" ? `&lang=${lang}` : "";
    const allowedMediaParam =
      allowedMediaTypesStrings.length > 0
        ? `&allowedMediaTypes=${allowedMediaTypesStrings.join(",")}`
        : "";
    const countryParam =
      countryCode !== "All" ? `&countryCode=${countryCode}` : "";

    const locations = geolocation
      ? `${geolocation.latitude.left},${geolocation.longitude.left},${geolocation.latitude.right},${geolocation.longitude.right}`
      : "";

    const resp = await fetch(
      geolocation
        ? `${SERVER_URL}/api/filter?num=${numTweets}&locations=${locations}${allowedMediaParam}`
        : `${SERVER_URL}/api/stream?num=${numTweets}&filterLevel=${filterLevel}${allowedMediaParam}${countryParam}${langParam}`
    );

    const data = await resp.json();

    setTweets(data);
  };

  return (
    <RowDiv>
      <StyledButton
        css={`
          width: fit-content;
        `}
        icon={<DiceIcon className="diceIcon" />}
        disabled={loading}
        onClick={fetchNewTweets}
        className="btnFetch"
        variant="contained"
        color="primary"
      >
        Twitter Stream
      </StyledButton>
    </RowDiv>
  );
}
