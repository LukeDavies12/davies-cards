import GameLog from "@/sections/game-log/game-log";
import Leaderboards from "@/sections/leaderboards/leaderboards";
import TopScore from "@/sections/top-score/top-score";

export default function Home() {
  return (
    <>
      <Leaderboards />
      <TopScore />
      <GameLog />
    </>
  );
}
