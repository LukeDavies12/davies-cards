import { db } from "@/db";
import Link from "next/link";
import { heartsColumns } from "../heartsParticipants/columns";
import { HeartsDataTable } from "../heartsParticipants/data-table";

async function getHeartsParticipants() {
  const participants = await db.participant.findMany({
    include: {
      games: {
        where: {
          gameTypeId: 2,
        },
      },
      gamesWon: {
        where: {
          gameTypeId: 2,
        },
      },
      gamesSecondPlace: {
        where: {
          gameTypeId: 2,
        },
      },
      gamesThirdPlace: {
        where: {
          gameTypeId: 2,
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
    const formattedPercentageWon = percentageWon.toFixed(1) + '%';

    return {
      ...participant,
      gamesPlayed,
      gamesWon,
      gamesSecondPlace,
      gamesThirdPlace,
      percentageWon: formattedPercentageWon,
      totalPoints,
    };
  });

  participantsWithStats = participantsWithStats.sort((a, b) => parseFloat(b.percentageWon) - parseFloat(a.percentageWon))
    .map((participant) => ({
      ...participant,
    }));

  return participantsWithStats;
}

export default async function Page() {
  const hearts = await getHeartsParticipants();

  return (
    <div>
      <div className="p-1 flex bg bg-neutral-100 rounded-md mb-4">
        <div className="w-1/2">
          <Link href={`/`}><div className="w-full flex justify-center py-1 rounded-md"><span className="text-neutral-500">O-Hell</span></div></Link>

        </div>
        <div className="w-1/2">
          <Link href={`/hearts`}><div className="w-full flex justify-center py-1 bg-white rounded-md shadow-sm"><span>Hearts</span></div></Link>
        </div>
      </div>
      <h1 className="text-2xl font-bold">Hearts Leaderboard</h1>
      <div className="py-4">
        <HeartsDataTable columns={heartsColumns} data={hearts} />
      </div>
      <Link href={`/hearts/games`} className="font-medium text-primary underline underline-offset-4">Game Log</Link>
    </div>
  )
}