import { VolumeUp, VolumeOff } from "@material-ui/icons";
import { IconButton, Tooltip } from "@material-ui/core";
import ReactPlayer from "react-player";
import styled from "styled-components/macro";
import { useAtom } from "jotai";
import { isMusicOnAtom } from "providers/store/store";

/** Mute button with hidden a <ReactPlayer/> */
export function AudioSoundButton({ title, href }) {
  console.log("🌟🚨 ~ AudioSoundButton ~ href", href);
  const [isAudioPlaying, setIsAudioPlaying] = useAtom(isMusicOnAtom);
  console.log("🌟🚨 ~ AudioSoundButton ~ isAudioPlaying", isAudioPlaying);

  return (
    <>
      <SoundButtonStyles {...{ isAudioPlaying }}>
        <div className="soundInfo">
          <a href={href} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </div>
        <Tooltip title={isAudioPlaying ? "mute 🔈" : "unmute 🔊"}>
          <IconButton onClick={() => setIsAudioPlaying(!isAudioPlaying)}>
            {isAudioPlaying ? <VolumeUp /> : <VolumeOff />}
          </IconButton>
        </Tooltip>
      </SoundButtonStyles>
      <ReactPlayer
        style={{ visibility: "hidden", position: "fixed" }}
        playing={isAudioPlaying}
        url={href}
      />
    </>
  );
}
const SoundButtonStyles = styled.div`
  height: 48px;
  white-space: nowrap;
  display: flex;
  position: fixed;
  top: 54px;
  right: 8px;
  align-items: center;
  .MuiButtonBase-root {
    color: hsla(0, 100%, 100%, 1);
  }
  .soundInfo {
    a {
      color: white;
    }
    opacity: ${(p) => (p.isAudioPlaying ? 0.3 : 0)};
    margin-top: -6px;
  }
  &:hover,
  &:active {
    .soundInfo {
      opacity: 1;
    }
  }
`;
