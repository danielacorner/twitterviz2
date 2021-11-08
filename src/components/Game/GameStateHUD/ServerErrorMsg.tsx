import { useAtom } from "jotai";
import { serverErrorAtom } from "providers/store/store";
import styled from "styled-components/macro";

export function ServerErrorMsg() {
  const [serverError] = useAtom(serverErrorAtom);
  const msUntilRateLimitReset = serverError?.msUntilRateLimitReset;
  return serverError ? (
    <ServerErrorStyles>
      🙏 please be patient as we migrate to twitter api v2{" "}
      {Object.entries(serverError || {}).length >
        (msUntilRateLimitReset ? 1 : 0) && JSON.stringify(serverError)}
      {msUntilRateLimitReset && process.env.NODE_ENV !== "production" ? (
        <div className="msUntilReset">
          {((msUntilRateLimitReset as number) / 1000 / 60 / 60 / 24).toFixed(2)}{" "}
          days until rate limit reset
        </div>
      ) : null}
    </ServerErrorStyles>
  ) : null;
}
const ServerErrorStyles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;
