import { useTweets } from "providers/store/useSelectors";
import HUD from "./HUD";
import { useThree } from "@react-three/fiber";
import { NodeBotScoreAntenna } from "./NodeBotScoreAntenna";
import { useSpring, animated } from "@react-spring/three";

const SCALE = 0.15;
const RADIUS = 40;

export function BotScoreLegend() {
	const tweets = useTweets();
	const showBotScore = Boolean(tweets.find((t) => t.user.botScore));
	const {
		size: { width, height },
	} = useThree();

	const springProps = useSpring({
		scale: showBotScore ? [1, 1, 1] : [0, 0, 0],
	});

	return showBotScore ? (
		<HUD position={[width / 2 - RADIUS * 2, height / 2 - RADIUS * 2.5, 0]}>
			<animated.mesh scale={springProps.scale}>
				<mesh>
					<meshLambertMaterial
						{...{ metalness: 1, color: "#316c83", emissive: "cornflowerblue" }}
					/>
					<sphereBufferGeometry args={[RADIUS * 0.007, 26, 26]} />
				</mesh>
				<mesh scale={[SCALE, SCALE, SCALE]}>
					<NodeBotScoreAntenna
						{...{
							showLabels: true,
							botScore: {
								overall: 1,
								fake_follower: 1,
								astroturf: 1,
								financial: 1,
								other: 1,
								self_declared: 1,
								spammer: 1,
							},
						}}
					/>
				</mesh>
			</animated.mesh>
		</HUD>
	) : null;
}
