import React, { useState } from "react";

import { IconButton } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";

export default function BtnFavorite({ tweet }) {
  const { favorites, toggleFavorite } = getFavorites();
  const isFavorite = favorites.includes(tweet.id_str);
  const [key, setKey] = useState(Math.random());
  const rerender = () => setKey(Math.random());
  return (
    <IconButton
      key={key}
      style={{
        color: isFavorite ? "tomato" : "hsla(0,0%,50%,0.5)",
        height: 18,
        width: 18,
      }}
      onClick={() => {
        toggleFavorite(tweet.id_str);
        rerender();
      }}
    >
      <FavoriteIcon />
    </IconButton>
  );
}

function getFavorites() {
  const getFavs = () =>
    JSON.parse(window.localStorage.getItem("favorites") || "[]");
  const favorites = getFavs();
  const setFavorites = (newFavorites) =>
    window.localStorage.setItem("favorites", JSON.stringify(newFavorites));
  const toggleFavorite = (tweetId) => {
    const favs = getFavs();
    const newFavorites = favs.includes(tweetId)
      ? [...favs.filter((tId) => tId !== tweetId)]
      : [...favs, tweetId];
    setFavorites(newFavorites);
  };
  return { favorites, setFavorites, toggleFavorite };
}
