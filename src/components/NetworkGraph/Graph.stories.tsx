import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import mockTweets from "../../assets/mockTweetsData 2.json";

import { mockTweetWithMedia, mockTweetWithImage } from "../../assets/mockData";
import { Tweet } from "types";
import { ForceGraph2D } from "react-force-graph";
import { GraphStyles } from "./NetworkGraph";

const mockTweet = mockTweets.tweets[0];

const mockForceGraphProps = {
  width: 794,
  height: 1009,
  d3VelocityDecay: 0.9,
  d3AlphaDecay: 0.007,
  cooldownTime: 15000,
  nodeRelSize: 25,
  linkWidth: 1,
  backgroundColor: "transparent",
  enableZoomPanInteraction: true,
  enableNavigationControls: true,
  enablePointerInteraction: true,
  enableNodeDrag: true,
};

const MockNetworkGraph: typeof ForceGraph2D = (props) => (
  <GraphStyles>
    <ForceGraph2D
      // ref={fgRef}
      {...{ ...mockForceGraphProps, ...props }}
    />
  </GraphStyles>
);

export default {
  title: "NetworkGraph/Graph2D",
  component: MockNetworkGraph,
  args: {
    springToMousePosition: {
      pointerEvents: "none",
      position: "fixed",
      opacity: 1,
      top: 16,
      left: 16,
      transform: `translate(${0}px,${0}px)`,
    },
    isLight: false,
    tooltipStyles: {
      pointerEvents: "auto",
    },
  },
} as Meta;

// https://www.learnstorybook.com/intro-to-storybook/react/en/simple-component/

// As we have multiple permutations of our component, it's convenient to assign it to a Template variable.
// Introducing this pattern in your stories will reduce the amount of code you need to write and maintain.
const Template: Story = (args) => <MockNetworkGraph {...args} />;

function getArgs(tweet: any) {
  return {
    originalPoster: tweet.user,
    tweet: (tweet as unknown) as Tweet,
  };
}

export const UserNodeWithBotScore = Template.bind({});
UserNodeWithBotScore.args = getArgs(mockTweet);

export const TooltipTweetAndVideo = Template.bind({});
TooltipTweetAndVideo.args = getArgs(mockTweetWithMedia);

export const TooltipTweetAndImage = Template.bind({});
TooltipTweetAndImage.args = getArgs(mockTweetWithImage);
