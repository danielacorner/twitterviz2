import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import mockTweetWithBotScore from "../../assets/mockTweetWithBotScore.json";

import { mockTweetWithMedia, mockTweetWithImage } from "../../assets/mockData";
import {
  NodeTooltipContent,
  NodeTooltipContentProps,
} from "../../components/NetworkGraph/NodeTooltip";
import { Tweet } from "types";

const mockTweet = mockTweetWithBotScore;

export default {
  title: "NetworkGraph/NodeTooltip",
  component: NodeTooltipContent,
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
const Template: Story<NodeTooltipContentProps> = (args) => (
  <NodeTooltipContent {...args} />
);

function getArgs(tweet: any) {
  return {
    originalPoster: tweet.user,
    tweet: (tweet as unknown) as Tweet,
  };
}

export const TooltipTweet = Template.bind({});
TooltipTweet.args = getArgs(mockTweet);

export const TooltipTweetAndVideo = Template.bind({});
TooltipTweetAndVideo.args = getArgs(mockTweetWithMedia);

export const TooltipTweetAndImage = Template.bind({});
TooltipTweetAndImage.args = getArgs(mockTweetWithImage);
