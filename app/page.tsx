import { db } from "@/db";
import { DataTable } from './participants/data-table';
import { ParticipantWithStats, columns } from './participants/columns';
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

async function getParticipants() {
  const participants = await db.participant.findMany({
    include: {
      games: true,
      gamesWon: true,
      gamesSecondPlace: true,
      gamesThirdPlace: true,
    },
  });

  let participantsWithStats: ParticipantWithStats[] = participants.map((participant) => {
    const gamesWon = participant.gamesWon.length;
    const gamesSecondPlace = participant.gamesSecondPlace.length;
    const gamesThirdPlace = participant.gamesThirdPlace.length;
    const totalPoints = gamesWon * 5 + gamesSecondPlace * 3 + gamesThirdPlace;
    const percentageWon = (gamesWon / participant.games.length) * 100;
    const formattedPercentageWon = percentageWon ? percentageWon.toFixed(1) + '%' : '0%';

    return {
      ...participant,
      gamesPlayed: participant.games.length,
      gamesWon,
      gamesSecondPlace,
      gamesThirdPlace,
      percentageWon: formattedPercentageWon,
      totalPoints,
    };
  });

  // Sort participants by win percentage in descending order and assign rank/place
  participantsWithStats = participantsWithStats.sort((a, b) => parseFloat(b.percentageWon) - parseFloat(a.percentageWon))
    .map((participant, index) => ({
      ...participant,
    }));

  return participantsWithStats;
}


export default async function Home() {
  const data = await getParticipants();

  return (
    <div>
      <Tabs defaultValue="o-hell" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-11">
          <TabsTrigger value="o-hell" className="py-2">O-Hell Leaderboard</TabsTrigger>
          <TabsTrigger value="password" className="py-2">Hearts Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value="o-hell">
          <div className="py-4">
            <DataTable columns={columns} data={data} />
          </div>
          <Link href={`/games`} className="font-medium text-primary underline underline-offset-4">Game Log</Link>
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  )
}
