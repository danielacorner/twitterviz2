import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import mockTweets from "../mockTweetsData 2.json";

import { mockTweetWithMedia, mockTweetWithImage } from "./mockData";
import {
  NodeTooltipContent,
  NodeTooltipContentProps,
} from "../components/NetworkGraph/NodeTooltip";
import { Tweet } from "types";

const mockTweet = mockTweets.tweets[0];

export default {
  title: "NetworkGraph/NodeTooltip",
  component: NodeTooltipContent,
} as Meta;

// https://www.learnstorybook.com/intro-to-storybook/react/en/simple-component/

// As we have multiple permutations of our component, it's convenient to assign it to a Template variable.
// Introducing this pattern in your stories will reduce the amount of code you need to write and maintain.
const Template: Story<NodeTooltipContentProps> = (args) => (
  <NodeTooltipContent {...args} />
);

export const TooltipTweet = Template.bind({});

TooltipTweet.args = {
  springToMousePosition: {
    pointerEvents: "none",
    position: "fixed",
    opacity: 1,
    top: 16,
    left: 16,
    transform: `translate(${0}px,${0}px)`,
  },
  isLight: false,
  originalPoster: mockTweet.user,
  tweet: (mockTweet as unknown) as Tweet,
  tooltipStyles: {
    pointerEvents: "auto",
  },
};

export const TooltipTweetAndVideo = Template.bind({});

TooltipTweetAndVideo.args = {
  springToMousePosition: {
    pointerEvents: "none",
    position: "fixed",
    opacity: 1,
    top: 16,
    left: 16,
    transform: `translate(${0}px,${0}px)`,
  },
  isLight: false,
  originalPoster: mockTweetWithMedia?.user,
  tweet: (mockTweetWithMedia as unknown) as Tweet,
  tooltipStyles: {
    pointerEvents: "auto",
  },
};

export const TooltipTweetAndImage = Template.bind({});

TooltipTweetAndImage.args = {
  springToMousePosition: {
    pointerEvents: "none",
    position: "fixed",
    opacity: 1,
    top: 16,
    left: 16,
    transform: `translate(${0}px,${0}px)`,
  },
  isLight: false,
  originalPoster: mockTweetWithImage?.user,
  tweet: (mockTweetWithImage as unknown) as Tweet,
  tooltipStyles: {
    pointerEvents: "auto",
  },
};
