import React, { useState, useEffect } from "react";

import { IconButton } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { useStoredSaves } from "../../providers/store";

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

/** localStorage getters, setters, togglers */
export function getFavorites() {
  // tweets

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

  // users

  const getFavUsers = () =>
    JSON.parse(window.localStorage.getItem("favoriteUsers") || "[]");
  const favoriteUsers = getFavUsers();

  const setFavoriteUsers = (newFavorites) =>
    window.localStorage.setItem("favoriteUsers", JSON.stringify(newFavorites));

  const toggleFavoriteUser = (userId) => {
    const favs = getFavUsers();
    const newFavorites = favs.includes(userId)
      ? [...favs.filter((uId) => uId !== userId)]
      : [...favs, userId];
    setFavoriteUsers(newFavorites);
  };

  return {
    favorites,
    favoriteUsers,
    setFavorites,
    setFavoriteUsers,
    toggleFavorite,
    toggleFavoriteUser,
  };
}

/** returns array of arrays of saved tweet ids */
export function useSavedDatasets(): {
  saves: { saveName: string; ids: string[] }[];
  setSaves: Function;
  deleteSaved: Function;
  addSave: Function;
} {
  const { saves, setSaves } = useStoredSaves();

  useEffect(() => {
    window.localStorage.setItem("saves", JSON.stringify(saves));
  }, [saves]);

  const addSave = (newSave: { saveName: string; ids: string[] }) => {
    setSaves([...saves, newSave]);
  };

  const deleteSaved = (savesIdx: number) => {
    const newSaves =
      saves.length === 0
        ? saves
        : [...saves.slice(0, savesIdx), ...saves.slice(savesIdx + 1)];
    setSaves(newSaves);
  };
  return { saves, setSaves, addSave, deleteSaved };
}
