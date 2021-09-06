import { VolumeUp, VolumeOff } from "@material-ui/icons";
import { IconButton, Tooltip } from "@material-ui/core";
import ReactPlayer from "react-player";
import styled from "styled-components/macro";
import { useAtom } from "jotai";
import { isMusicOnAtom, volumeAtom } from "providers/store/store";
import { useState } from "react";
const NUM_VOLUME_STEPS = 20;

/** Mute button with hidden a <ReactPlayer/> */
export function AudioSoundButton({ title, href }) {
  const [isAudioPlaying, setIsAudioPlaying] = useAtom(isMusicOnAtom);

  const [isHovered, setIsHovered] = useState(false);
  const [volume, setVolume] = useAtom(volumeAtom);
  return (
    <>
      <SoundButtonStyles
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...{ isAudioPlaying }}
      >
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
        {isHovered && <VolumeControls {...{ volume, setVolume }} />}
      </SoundButtonStyles>
      <ReactPlayer
        style={{ visibility: "hidden", position: "fixed" }}
        playing={isAudioPlaying}
        volume={volume / NUM_VOLUME_STEPS}
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
  padding-bottom: 16px;
  align-items: center;
  z-index: 9;
  &&&&&&&&&&&&& {
    padding-right: 16px;
    margin-right: -16px;
  }
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
function VolumeControls({ volume, setVolume }) {
  const [isAudioPlaying] = useAtom(isMusicOnAtom);

  return (
    <VolumeControlsStyles {...{ isAudioPlaying }}>
      <div className="volumeControlsContent">
        {[...Array(NUM_VOLUME_STEPS + 1)].map((_, idx) => (
          <div
            className={`volumeTick${volume > idx ? " active" : ""}${
              volume === idx ? " current" : ""
            }`}
            onClick={() => {
              setVolume(idx);
            }}
          >
            <Tooltip title={`${(idx * 100) / NUM_VOLUME_STEPS}%`}>
              <div className="tickBackground"></div>
            </Tooltip>
          </div>
        ))}
      </div>
    </VolumeControlsStyles>
  );
}
const VolumeControlsStyles = styled.div`
  position: relative;
  .volumeControlsContent {
    cursor: pointer;
    display: flex;
    position: absolute;
    bottom: -36px;
    right: 12px;
  }
  .volumeTick {
    padding: 12px 0;
    margin: -12px 0;
    width: 4px;
    height: 6px;
    box-sizing: border-box;
    .tickBackground {
      margin-top: -12px;
      height: 6px;
      background: #2c2c2c;
    }
    &.active {
      .tickBackground {
        background: ${(p) => (p.isAudioPlaying ? "#fff" : "#555")};
      }
    }
    &.current {
      position: relative;
      &:after {
        position: absolute;
        content: "";
        top: -3.5px;
        left: -6px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #a8a8a8;
      }
    }
  }
`;
