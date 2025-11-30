import { getCurrentSession } from "@/lib/auth";
import GameLog from "@/sections/game-log/game-log";
import Leaderboards from "@/sections/leaderboards/leaderboards";
import TopScore from "@/sections/top-score/top-score";

export default async function Home() {
  const { user } = await getCurrentSession();

  return (
    <>
      <Leaderboards />
      <TopScore />
      <GameLog isSignedIn={!!user} />
    </>
  );
}
