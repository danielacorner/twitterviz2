import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import mockTweets from "../mockTweetsData.json";
import {
  NodeTooltipContent,
  NodeTooltipContentProps,
} from "../components/NodeTooltip";

const mockTweet = mockTweets[0];

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

export const TooltipWithTweet = Template.bind({});

TooltipWithTweet.args = {
  springToMousePosition: null,
  isLight: false,
  originalPoster: mockTweet.user,
  tweet: mockTweet,
};
