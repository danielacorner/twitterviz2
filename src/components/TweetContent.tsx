import React from "react";
import { getMediaArr, PADDING } from "../utils/utils";
import countryCodes from "../utils/countryCodes";
import styled from "styled-components/macro";

const TweetStyles = styled.div`
  display: grid;
  grid-gap: ${PADDING}px;
  .userInfo, .locationInfo {
    display: grid;
    grid-auto-flow:column;
    place-content: start;
    grid-gap: 4px;
  }
  .userInfo {}
  .locationInfo{
    color: hsl(0,0%,50%)
  }
  .media {
    display: grid;
    max-height: calc(100vh - 100px);
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    ${(props) => (props.isVideo ? "grid-template-columns: 1fr;" : "")}
    grid-gap: ${PADDING}px;
    img {
      width: 100%;
    }
    video{
      width: 100%;
    }
  }
`;

export default function TweetContent({ nodeData }) {
  const { user, text, extended_entities, entities } = nodeData;
  const mediaArr = getMediaArr(nodeData);
  return (
    <TweetStyles isVideo={extended_entities?.media[0]?.type === "video"}>
      <div className="userInfo">
        <div className="username">{user.name}</div>
        <div className="handle">| @{user.screen_name}</div>
      </div>
      <div className="locationInfo">
        {user.location && (
          <div className="location">
            <span aria-label="pin" role="img">
              📍
            </span>
            {user.location}
          </div>
        )}
        {entities?.place?.country_code && (
          <div className="country">
            | {countryCodes[entities?.place?.country_code]}
          </div>
        )}
      </div>
      <div className="text">{text}</div>

      {mediaArr.map(({ type, id_str, poster, src }) => {
        return (
          <div className="media" key={id_str}>
            {type === "video" ? (
              <video
                poster={poster}
                src={src}
                autoPlay={true}
                loop={true}
              ></video>
            ) : (
              <img src={src} alt="" />
            )}
          </div>
        );
      })}
    </TweetStyles>
  );
}
