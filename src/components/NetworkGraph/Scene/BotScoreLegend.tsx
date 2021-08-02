import { useTweets } from "providers/store/useSelectors";
import HUD from "./HUD";
import { useThree } from "@react-three/fiber";
import { NodeBotScoreAntenna } from "./Node/NodeBotScoreAntenna";
import { useSpring, animated } from "@react-spring/three";
import { gameStateAtom, GameStepsEnum } from "providers/store/store";
import { useAtom } from "jotai";

const SCALE = 0.15;
const RADIUS = 40;

export function BotScoreLegend({
	position = undefined as number[] | undefined,
	scale = undefined as number[] | undefined,
	isInStartMenu = false,
}) {
	const tweets = useTweets();
	const showBotScore =
		isInStartMenu || Boolean(tweets.find((t) => t.user.botScore));
	const {
		size: { width, height },
	} = useThree();
	const [gameState] = useAtom(gameStateAtom);
	const isGameOver = gameState.step === GameStepsEnum.gameOver;

	const show = !isGameOver && showBotScore;
	const springProps = useSpring({
		scale: show ? scale || [1, 1, 1] : [0, 0, 0],
	});

	return (
		<HUD
			position={
				position || [width / 2 - RADIUS * 2, height / 2 - RADIUS * 2.5, 0]
			}
		>
			<animated.mesh scale={springProps.scale} position={position}>
				<mesh>
					<meshPhysicalMaterial
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
	);
}
