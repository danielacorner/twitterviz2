import { useRef, useState } from "react";
import styled from "styled-components/macro";
import { Menu, IconButton, MenuItem } from "@material-ui/core";
import HighQualityIcon from "@material-ui/icons/HighQuality";
import { Variant } from "../../../types";
// import { Player, ControlBar, VolumeMenuButton } from "video-react";
import { MediaItem } from "../../../utils/utils";

// https://video-react.js.org/

const VideoStyles = styled.div`
	.video-react {
		padding: 0 !important;
		position: static !important;
	}
	.video-react-big-play-button {
		display: none;
	}
	.video-react-icon-fullscreen {
		margin-right: 30px;
	}
	.video-react-play-progress:after {
		white-space: nowrap;
	}
	.video-react-play-control {
		display: none;
	}
	.video-react-current-time {
		padding-right: 0.2em;
		padding-left: 0.5em;
	}
	.video-react-duration {
		padding-left: 0.2em;
		padding-right: 0.5em;
	}
	.video-react-slider {
		padding: 16px 0;
		background: none;
	}
	.video-react-slider:focus {
		box-shadow: none;
	}
	.video-react-load-progress,
	.video-react-slider-bar {
		margin-top: 14px !important;
	}
`;
export default function VideoWithControls({
	videoRef,
	containerWidth,
	mediaItem,
	isTooltip,
}: {
	videoRef: { current: any };
	containerWidth: number;
	mediaItem: MediaItem;
	isTooltip: boolean;
}) {
	const { variants, sizes, poster } = mediaItem;

	const [bitrate, setBitrate] = useState(
		variants[variants.length - 1].bitrate || 0
	);
	const height = (containerWidth * sizes.large.h) / sizes.large.w;
	return null;
	// <VideoStyles style={{ height }}>
	//   <Player
	//     ref={videoRef}
	//     muted={isTooltip}
	//     controls={true}
	//     src={variants.find((v) => v.bitrate === bitrate)?.url}
	//     poster={poster}
	//     autoPlay={true}
	//     loop={true}
	//     width={containerWidth}
	//     height={height}
	//     preload="none"
	//   >
	//     <ControlBar autoHide={true}>
	//       <VolumeMenuButton vertical={true} />
	//       <BitrateControls
	//         {...{
	//           bitrate,
	//           setBitrate,
	//           variants,
	//         }}
	//       />
	//     </ControlBar>
	//   </Player>
	// </VideoStyles>
}

const BitrateStyles = styled.div`
	position: absolute;
	right: 0;
	bottom: 0;
	top: 0;
	align-items: center;
	display: flex;
	padding-right: 6px;
`;
function BitrateControls({
	bitrate,
	setBitrate,
	variants,
}: {
	bitrate: number;
	setBitrate: Function;
	variants: Variant[];
}) {
	// open/close the bitrate menu
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const ref = useRef();

	return (
		<BitrateStyles>
			<IconButton
				size="small"
				ref={ref as any}
				onClick={() => setIsMenuOpen((p) => !p)}
			>
				<HighQualityIcon />
			</IconButton>
			<Menu
				anchorEl={ref.current}
				open={isMenuOpen}
				onChange={(event) => {
					setBitrate((event.target as any).value);
				}}
				onClose={() => setIsMenuOpen(false)}
			>
				{variants
					.sort((a, b) =>
						a?.bitrate && b?.bitrate ? a.bitrate - b.bitrate : 0
					)
					.map((variant) => (
						<MenuItem
							{...(variant.bitrate === bitrate
								? { disabled: true, style: { background: "hsl(0,0%,50%)" } }
								: {})}
							onClick={() => setBitrate(variant.bitrate)}
							key={variant.url}
							value={variant.url}
						>
							{variant.bitrate || 0}
						</MenuItem>
					))}
			</Menu>
		</BitrateStyles>
	);
}
