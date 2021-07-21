import styled from "styled-components/macro";
import { User } from "types";
import { darkBackground } from "utils/colors";
import { AVATAR_WIDTH, TOOLTIP_WIDTH } from "utils/constants";

export function UserProfile({ user }: { user: User }) {
	return (
		<UserProfileStyles>
			{user.profile_background_image_url_https ? (
				<img
					className="backgroundImage"
					src={user.profile_background_image_url_https}
					alt=""
				/>
			) : (
				<div
					className="backgroundImage"
					style={{ backgroundColor: "#" + user.profile_background_color }}
				/>
			)}
			<img
				className="avatar"
				src={user.profile_image_url}
				alt={user.name}
				width={AVATAR_WIDTH}
				height={AVATAR_WIDTH}
			/>
			<div className="username">{user.name}</div>
			<div className="handle">{user.screen_name}</div>
			<div className="description">{user.description}</div>
			<div className="metadata">
				<div className="following">{user.following}</div>
				<div className="followers">{user.followers_count}</div>
			</div>
		</UserProfileStyles>
	);
}
const UserProfileStyles = styled.div`
	display: grid;
	overflow: hidden;
	border-radius: 16px;
	&&& {
		margin-left: -12px;
		margin-top: -12px;
	}
	width: calc(100% + 30px);
	padding: 0 16px;
	.backgroundImage {
		margin: 0 -16px;
		background-size: cover;
		width: ${TOOLTIP_WIDTH}px;
		height: ${TOOLTIP_WIDTH / 3}px;
	}
	.avatar {
		border-radius: 50%;
		width: ${AVATAR_WIDTH * 2.7}px;
		height: ${AVATAR_WIDTH * 2.7}px;
		margin-top: -${(AVATAR_WIDTH * 2.7) / 2}px;
		border: 5px solid ${darkBackground};
	}
`;
