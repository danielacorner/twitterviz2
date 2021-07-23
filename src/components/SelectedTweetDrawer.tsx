import styled from "styled-components/macro";
import {
	getOriginalPoster,
	useSelectedNode,
	useSetSelectedNode,
} from "../providers/store/useSelectors";
import { Drawer } from "@material-ui/core";
import { Timeline, Tweet as TweetWidget } from "react-twitter-widgets";

export function SelectedTweetDrawer() {
	const selectedNode = useSelectedNode();
	const setSelectedNode = useSetSelectedNode();
	const originalPoster = selectedNode && getOriginalPoster(selectedNode);
	return (
		<Drawer
			anchor="right"
			open={Boolean(originalPoster)}
			onClose={() => setSelectedNode(null)}
		>
			{originalPoster && (
				<DrawerContentStyles>
					{selectedNode && (
						<TweetWidget
							tweetId={selectedNode.id_str}
							options={{ theme: "dark" }}
						/>
					)}
					<Timeline
						dataSource={{
							sourceType: "profile",
							screenName: originalPoster.screen_name,
						}}
						options={{
							theme: "dark",
						}}
					/>
				</DrawerContentStyles>
			)}
		</Drawer>
	);
}
const DrawerContentStyles = styled.div``;
