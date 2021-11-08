import { useAtom } from "jotai";
import { shuffle } from "lodash";
import { serverErrorAtom } from "providers/store/store";
import Score from "../Score";
import { AudioSoundButton } from "./AudioSoundButton";
import { ShotsRemaining } from "./ShotsRemaining";
import styled from "styled-components/macro";
import { BotScoreInfoCard } from "./BotScoreInfoCard";
export function GameStateHUD() {
  const song = shuffle(trackList)[0];

  return (
    <>
      <Score />
      <ShotsRemaining />
      <ServerErrorMsg />
      <BotScoreInfoCard />

      <AudioSoundButton
        {...{
          title: song.title,
          href: getHrefFromTimeQuery(song.timeQuery),
        }}
      />
    </>
  );
}
function ServerErrorMsg() {
  const [serverError] = useAtom(serverErrorAtom);
  const msUntilRateLimitReset = serverError?.msUntilRateLimitReset;
  return serverError ? (
    <ServerErrorStyles>
      {Object.entries(serverError || {}).length >
        (msUntilRateLimitReset ? 1 : 0) && JSON.stringify(serverError)}
      {msUntilRateLimitReset && process.env.NODE_ENV !== "production" ? (
        <div className="msUntilReset">
          {((msUntilRateLimitReset as number) / 1000 / 60 / 60 / 24).toFixed(2)}{" "}
          days until rate limit reset
        </div>
      ) : null}
    </ServerErrorStyles>
  ) : null;
}
const ServerErrorStyles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;
function getHrefFromTimeQuery(timeQuery: string) {
  return `https://www.youtube.com/watch?v=JIznHcm9TSU&t=${timeQuery}`;
}

const trackList: { [trackTitle: string]: string }[] = [
  { title: "Subnautica – Below Zero", timeQuery: "0m00s" },
  { title: "Subnautica – I'll Find My Way Back", timeQuery: "2m41s" },
  { title: "Subnautica – Welcome to 4546b", timeQuery: "4m03s" },
  { title: "Subnautica – Twisty Bridges", timeQuery: "5m31s" },
  { title: "Subnautica – Arctic Peeper", timeQuery: "8m21s" },
  { title: "Subnautica – Ice Floes", timeQuery: "10m09s" },
  { title: "Subnautica – Light Rays", timeQuery: "13m31s" },
  { title: "Subnautica – Kelp Caves", timeQuery: "16m28s" },
  { title: "Subnautica – Far Less Alone", timeQuery: "19m48s" },
  { title: "Subnautica – A Larger Consciousness", timeQuery: "22m49s" },
  { title: "Subnautica – A Continuous Thrum", timeQuery: "25m04s" },
  { title: "Subnautica – The Obelisk", timeQuery: "27m43s" },
  { title: "Subnautica – A Thousand Strings", timeQuery: "29m49s" },
  { title: "Subnautica – Mirage Machine", timeQuery: "34m29s" },
  { title: "Subnautica – Lithium", timeQuery: "38m27s" },
  { title: "Subnautica – Magnetite", timeQuery: "40m15s" },
  { title: "Subnautica – Cyrptosuchus", timeQuery: "41m31s" }, // 🌟
  { title: "Subnautica – Titan Holefish", timeQuery: "43m06s" },
  { title: "Subnautica – Stay off My Land", timeQuery: "44m26s" },
  { title: "Subnautica – Glacial Basin", timeQuery: "46m37s" },
  { title: "Subnautica – Molten Silver", timeQuery: "49m12s" },
  { title: "Subnautica – A Cold Wet Planet", timeQuery: "52m34s" },
  { title: "Subnautica – Phi Robotics", timeQuery: "54m32s" },
  {
    title: "Subnautica – I Am Relieved It Is Still Frozen",
    timeQuery: "56m26s",
  },
  { title: "Subnautica – Part Organic Part Digital", timeQuery: "56m59s" },
  { title: "Subnautica – Leaves of Quartz", timeQuery: "59m14s" },
  { title: "Subnautica – We Exist as Data", timeQuery: "1h01m50s" },
  { title: "Subnautica – Mercury II", timeQuery: "1h05m27s" },
  { title: "Subnautica – Spinefish", timeQuery: "1h08m03s" },
  { title: "Subnautica – Koppa Mining Site", timeQuery: "1h11m16s" },
  { title: "Subnautica – Cathedral", timeQuery: "1h13m31s" },
  { title: "Subnautica – Lily Pads", timeQuery: "1h16m58s" },
  { title: "Subnautica – A Study In Parhelion Red", timeQuery: "1h20m49s" },
  { title: "Subnautica – Glowlights", timeQuery: "1h24m34s" },
  { title: "Subnautica – Iceberg", timeQuery: "1h27m37s" },
  { title: "Subnautica – Glow Whale", timeQuery: "1h32m34s" },
  { title: "Subnautica – Medusa Planetarium", timeQuery: "1h34m54s" },
  { title: "Subnautica – Limestone", timeQuery: "1h38m29s" },
  { title: "Subnautica – Slow Burn", timeQuery: "1h40m41s" },
  { title: "Subnautica – This Planet Is Cursed", timeQuery: "1h50m01s" },
  { title: "Subnautica – The Glacial Forest", timeQuery: "1h53m13s" },
  { title: "Subnautica – The Ice Worm", timeQuery: "1h55m57s" },
  { title: "Subnautica – Sam's Discoveries", timeQuery: "1h57m39s" },
  { title: "Subnautica – The Void", timeQuery: "2h02m23s" },
  { title: "Subnautica – Crystal Caves", timeQuery: "2h04m05s" },
  { title: "Subnautica – Crystal Castle", timeQuery: "2h06m17s" },
  { title: "Subnautica – Fabricator Caverns", timeQuery: "2h07m30s" },
  { title: "Subnautica – Shadow Leviathan", timeQuery: "2h08m34s" },
  { title: "Subnautica – Ten Thousand Souls", timeQuery: "2h10m02s" },
  {
    title: "Subnautica – In Search of Familiar Harmonies (Credits Music)",
    timeQuery: "2h13m44s",
  },
  { title: "Subnautica – Twilit Waters (Bonus)", timeQuery: "2h17m44s" },
  {
    title: "Subnautica – Glacial Basin Extended (Bonus)",
    timeQuery: "2h19m47s",
  },
  { title: "Subnautica – The Dark (Bonus)", timeQuery: "2h22m46s" },
  { title: "Subnautica – Spy Penguin Theme (Bonus)", timeQuery: "2h24m31s" },
];
