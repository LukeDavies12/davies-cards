import { db } from "@/db";
import Link from "next/link";
import { columns } from './participants/columns';
import { DataTable } from './participants/data-table';

async function getParticipants() {
  const participants = await db.participant.findMany({
    include: {
      games: {
        where: {
          gameTypeId: 1,
        },
      },
      gamesWon: {
        where: {
          gameTypeId: 1,
        },
      },
      gamesSecondPlace: {
        where: {
          gameTypeId: 1,
        },
      },
      gamesThirdPlace: {
        where: {
          gameTypeId: 1,
        },
      },
    },
  });

  let participantsWithStats = participants.map((participant) => {
    const gamesWon = participant.gamesWon.length;
    const gamesSecondPlace = participant.gamesSecondPlace.length;
    const gamesThirdPlace = participant.gamesThirdPlace.length;
    const gamesPlayed = participant.games.length;
    const rawTotalPoints = gamesWon * 5 + gamesSecondPlace * 3 + gamesThirdPlace;
    const totalPoints = (gamesPlayed > 0 ? parseFloat((rawTotalPoints / gamesPlayed).toFixed(1)) : 0) * 10;
    const percentageWon = gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0;
    const percentageWonString = percentageWon.toFixed(1) + '%';

    return {
      ...participant,
      gamesPlayed,
      gamesWon,
      gamesSecondPlace,
      gamesThirdPlace,
      percentageWonString,
      percentageWon,
      totalPoints,
    };
  });
  // Sort participants by win percentage in descending order and assign rank/place
  participantsWithStats = participantsWithStats.sort((a, b) => b.percentageWon - a.percentageWon)
    .map((participant) => ({
      ...participant,
    }));

  return participantsWithStats;
}

export default async function Home() {
  const oHell = await getParticipants();

  return (
    <div>
      <div className="p-1 flex bg bg-neutral-100 rounded-md mb-4">
        <div className="w-1/2">
          <Link href={`/`}><div className="w-full flex justify-center py-1 bg-white rounded-md shadow-sm"><span>O-Hell</span></div></Link>
        </div>
        <div className="w-1/2">
          <Link href={`/hearts`}><div className="w-full flex justify-center py-1 rounded-md"><span className="text-neutral-500">Hearts</span></div></Link>
        </div>
      </div>
      <h1 className="text-2xl font-bold">O Hell Leaderboard</h1>
      <div className="py-4">
        <DataTable columns={columns} data={oHell} />
      </div>
      <Link href={`/o-hell/games`} className="font-medium text-primary underline underline-offset-4">Game Log</Link>
    </div>
  )
}
