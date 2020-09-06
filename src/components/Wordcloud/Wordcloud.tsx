import React from "react";
import ReactWordcloud from "react-wordcloud";
import styled from "styled-components/macro";
import { useTweets, useWordcloudConfig } from "../../providers/store";

const WordcloudStyles = styled.div``;

/** https://www.npmjs.com/package/react-wordcloud  */
const Wordcloud = () => {
  const tweets = useTweets();
  const { minChars, maxChars } = useWordcloudConfig();

  // grab text from tweet, quoted tweet
  const tweetsWithText: {
    id_str: string;
    text: string;
    quotedText: string | null;
  }[] = tweets.map((t) => ({
    id_str: t.id_str,
    text: t.text,
    quotedText: t.quoted_status?.text,
  }));
  console.log("🌟🚨: Wordcloud -> tweets", tweets);

  const allTextJoined: string = tweetsWithText.reduce((acc, cur) => {
    return acc + cur.text + (cur.quotedText || "");
  }, "");

  const allWords = allTextJoined.split(" ");

  // first, convert into an object with keys for each word (so we don't have to do a double-loop search)

  const allWordsObj: { [word: string]: number } = allWords.reduce(
    (acc, word) => {
      return { ...acc, [word]: word in acc ? acc[word] + 1 : 1 };
    },
    {}
  );

  // then, turn the object into an array

  const words: { text: string; value: number }[] = Object.entries(allWordsObj)
    .filter(([word, value]) => minChars < word.length && word.length < maxChars)
    .map(([word, value]) => ({ text: word, value }));

  console.log("🌟🚨: Wordcloud -> words", words);
  return (
    <WordcloudStyles>
      <ReactWordcloud words={words} />
    </WordcloudStyles>
  );
};

export default Wordcloud;
