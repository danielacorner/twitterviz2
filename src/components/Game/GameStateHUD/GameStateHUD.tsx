import { shuffle } from "lodash";
import Score from "../Score";
import { AudioSoundButton } from "./AudioSoundButton";
import { ShotsRemaining } from "./ShotsRemaining";

export function GameStateHUD() {
  const song = shuffle(trackList)[0];

  return (
    <>
      <Score />
      <ShotsRemaining />
      <AudioSoundButton
        {...{
          title: song.title,
          href: getHrefFromTimeQuery(song.timeQuery),
        }}
      />
    </>
  );
}

function getHrefFromTimeQuery(timeQuery: string) {
  return `https://www.youtube.com/watch?v=aT9_-P7N950&t=${timeQuery}`;
}

const trackList: { [trackTitle: string]: string }[] = [
  { title: "Subnautica — Salutations", timeQuery: "0m00s" },
  { title: "Subnautica — Into The Unknown", timeQuery: "1m49s" },
  { title: "Subnautica — Tropical Eden", timeQuery: "4m48s" },
  { title: "Subnautica — God Rays", timeQuery: "6m31s" },
  { title: "Subnautica — In Bloom", timeQuery: "8m00s" },
  { title: "Subnautica — Precipice", timeQuery: "10m10s" },
  { title: "Subnautica — Sun & Moon", timeQuery: "12m10s" },
  { title: "Subnautica — Finding Life", timeQuery: "14m39s" },
  { title: "Subnautica — Crush Depth", timeQuery: "16m49s" },
  { title: "Subnautica — What are You", timeQuery: "19m11s" },
  {
    title: "Subnautica — Original Inhabitants",
    timeQuery: "20m31s",
  },
  { title: "Subnautica — A Tendency to Float", timeQuery: "22m36s" },
  { title: "Subnautica — Abandon Ship", timeQuery: "23m54s" },
  { title: "Subnautica — Ahead Slow", timeQuery: "25m38s" },
  { title: "Subnautica — Alien Expanse", timeQuery: "27m17s" },
  { title: "Subnautica — Alien Passageways", timeQuery: "28m57s" },
  { title: "Subnautica — Alien Spaces", timeQuery: "31m15s" },
  { title: "Subnautica — Alterra Science", timeQuery: "33m01s" },
  { title: "Subnautica — Amid the Kelp", timeQuery: "35m11s" },
  { title: "Subnautica — Ancient Aliens", timeQuery: "36m40s" },
  { title: "Subnautica — Arc Lights", timeQuery: "38m17s" },
  { title: "Subnautica — Blood Crawlers", timeQuery: "39m52s" },
  { title: "Subnautica — Blueprint", timeQuery: "41m35s" },
  { title: "Subnautica — Bone Fields", timeQuery: "43m09s" },
  { title: "Subnautica — Bring a Medpack", timeQuery: "45m21s" },
  { title: "Subnautica — Buoyancy", timeQuery: "47m17s" },
  { title: "Subnautica — Caverns", timeQuery: "48m14s" },
  { title: "Subnautica — Coral Reef", timeQuery: "50m36s" },
  { title: "Subnautica — Crash Site", timeQuery: "51m45s" },
  { title: "Subnautica — Cuddlefish", timeQuery: "54m14s" },
  { title: "Subnautica — Dark Matter Reactor", timeQuery: "55m22s" },
  { title: "Subnautica — Exosuit", timeQuery: "56m52s" },
  { title: "Subnautica — Fear the Reapers", timeQuery: "58m57s" },
  { title: "Subnautica — First Immersion 1", timeQuery: "00m19s" },
  { title: "Subnautica — Ghost Tree 1", timeQuery: "01m58s" },
  { title: "Subnautica — Ghosts 1", timeQuery: "03m38s" },
  { title: "Subnautica — Habitat 1", timeQuery: "05m37s" },
  { title: "Subnautica — Infected 1", timeQuery: "07m17s" },
  {
    title: "Subnautica — Islands Beneath the Sea 1",
    timeQuery: "08m28s",
  },
  { title: "Subnautica — Lava Castle 1", timeQuery: "11m16s" },
  { title: "Subnautica — Leviathan 1", timeQuery: "13m28s" },
  { title: "Subnautica — Cycle of Life 1", timeQuery: "14m34s" },
  { title: "Subnautica — Lost River 1", timeQuery: "15m53s" },
  { title: "Subnautica — Maneuvers 1", timeQuery: "17m15s" },
  { title: "Subnautica — Mushroom Forest 1", timeQuery: "19m54s" },
  { title: "Subnautica — Observatory Zen 1", timeQuery: "22m09s" },
  { title: "Subnautica — Red Alert 1", timeQuery: "23m31s" },
  // { title: "Subnautica — Rock It! 1", timeQuery: "24m41s" },
  {
    title: "Subnautica — Safe in Kelp forest 1",
    timeQuery: "25m47s",
  },
  { title: "Subnautica — Seamoth 1", timeQuery: "27m18s" },
  {
    title: "Subnautica — Shadow of the Reefback 1",
    timeQuery: "28m45s",
  },
  { title: "Subnautica — Shallows 1", timeQuery: "30m49s" },
  { title: "Subnautica — Sunbeam 1", timeQuery: "32m39s" },
  { title: "Subnautica — Unknown Flora 1", timeQuery: "33m57s" },
  { title: "Subnautica — Violet Beau 1", timeQuery: "36m40s" },
  { title: "Subnautica — Lift Off 1", timeQuery: "37m59s" },
];
