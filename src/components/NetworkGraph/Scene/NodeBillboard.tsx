import { TooltipContent, TooltipStyles } from "../NodeTooltip";
import styled from "styled-components/macro";
import { useIsLight } from "providers/ThemeManager";
import { getOriginalPoster } from "providers/store/useSelectors";
import { Html, Billboard } from "@react-three/drei";
import { DISABLE_SELECTION_OF_TEXT_CSS } from "utils/constants";

export default function NodeBillboard({ tweets }) {
	const isLight = useIsLight();
	const originalPoster = getOriginalPoster(tweets[0]);
	return (
		<Billboard {...({} as any)}>
			<Html
				transform={true}
				sprite={false}
				style={{
					width: 0,
					height: 0,
					marginLeft: -100,
					marginTop: -100,
					// pointerEvents: "none",
				}}
			>
				<HtmlStyles>
					<AvatarStyles>
						<img src={originalPoster?.profile_image_url_https} alt="" />
					</AvatarStyles>
					<TweetsColumnStyles>
						{tweets.map((tweet) => (
							<TooltipStyles
								{...{
									isLight,
									width: 200,
									css: `
                .id_str {display:none;}
      `,
								}}
							>
								<TooltipContent {...{ originalPoster, tweet }} />
							</TooltipStyles>
						))}
					</TweetsColumnStyles>
				</HtmlStyles>
			</Html>
		</Billboard>
	);
}

const HtmlStyles = styled.div`
	pointer-events: none;
	${DISABLE_SELECTION_OF_TEXT_CSS}
	position: relative;
	width: 200px;
`;
const AvatarStyles = styled.div`
	width: 100%;
	height: 100%;
	transform: scale(0.5);
	border-radius: 50%;
	overflow: hidden;
	pointer-events: none;
	img {
		width: 100%;
		height: auto;
	}
`;
const TweetsColumnStyles = styled.div`
	position: absolute;
	top: 96px;
	font-size: 12px;
	color: hsla(0, 0%, 95%, 0.9);
	transform: translateY(120px);
	min-height: 200px;
	display: grid;
	gap: 12px;
`;
