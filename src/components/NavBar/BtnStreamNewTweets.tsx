import {
  useAddTweets,
  useLoading,
  useAllowedMediaTypes,
  useSetLoading,
} from "../../providers/store/useSelectors";
import { useConfig } from "../../providers/store/useConfig";
import DiceIcon from "@material-ui/icons/Casino";
import { BREAKPOINTS, SERVER_URL } from "../../utils/constants";
import { StyledButton } from "../Controls/Buttons/StyledButton";

export function BtnStreamNewTweets() {
  const { lang, countryCode, numTweets, filterLevel, geolocation } =
    useConfig();
  const allowedMediaTypesStrings = useAllowedMediaTypes();
  const loading = useLoading();
  const setLoading = useSetLoading();
  const addTweets = useAddTweets();

  // TODO: when we fetch tweets, for each user, fetch 3 more tweets from them??
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

    addTweets(data);
  };

  return (
    <StyledButton
      css={`
        width: fit-content;
        width: 60px;
        transform: translateY(10px);
        &&& {
          padding: 8px;
        }
        .MuiButton-label {
          font-size: 12px;
          line-height: 1.2em;
        }
        justify-self: center;
        align-self: start;
        @media (min-width: ${BREAKPOINTS.TABLET}px) {
          transform: none;
          align-self: unset;
          width: fit-content;
          white-space: nowrap;
          &&& {
            padding: 8px 16px;
          }
          .MuiButton-label {
            font-size: 16px;
          }
        }
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
  );
}
