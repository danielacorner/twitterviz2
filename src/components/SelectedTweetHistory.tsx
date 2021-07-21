import styled from "styled-components/macro";
import { useAtom } from "jotai";
import { selectedNodeHistoryAtom } from "providers/store/store";
import { Tweet as TweetWidget } from "react-twitter-widgets";

export function SelectedTweetHistory() {
	const [selectedNodeHistory] = useAtom(selectedNodeHistoryAtom);
	return (
		<SelectedTweetHistoryStyles>
			{selectedNodeHistory.map((node) => (
				<TweetWidget
					tweetId={node.id_str}
					options={{ dnt: true, theme: "dark" }}
				/>
			))}
		</SelectedTweetHistoryStyles>
	);
}
const SelectedTweetHistoryStyles = styled.div`
	position: fixed;
	bottom: 0;
	right: 0;
	display: flex;
`;
