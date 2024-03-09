import { db } from "@/db";
import Link from "next/link";
import { columns } from "./participants/columns";
import { DataTable } from "./participants/data-table";
import dynamic from "next/dynamic";
import { Participant } from "@prisma/client";
const ParticipantChart = dynamic(
  () => import("../components/charts/mainCharts"),
  { ssr: false },
);

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

  let participantsWithStats = participants.map((participant: any) => {
    const gamesWon = participant.gamesWon.length;
    const gamesSecondPlace = participant.gamesSecondPlace.length;
    const gamesThirdPlace = participant.gamesThirdPlace.length;
    const gamesPlayed = participant.games.length;
    const rawTotalPoints =
      gamesWon * 5 + gamesSecondPlace * 3 + gamesThirdPlace;
    const totalPoints =
      (gamesPlayed > 0
        ? parseFloat((rawTotalPoints / gamesPlayed).toFixed(1))
        : 0) * 10;
    const percentageWon = gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0;
    const percentageWonString = percentageWon.toFixed(1) + "%";

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

  participantsWithStats = participantsWithStats
    .sort((a: any, b: any) => b.percentageWon - a.percentageWon)
    .map((participant) => ({
      ...participant,
    }));

  return participantsWithStats;
}

export default async function Home() {
  const oHell = await getParticipants();

  return (
    <div>
      <div className="bg mb-4 flex rounded-md bg-neutral-100 p-1">
        <div className="w-1/2">
          <Link href={`/`}>
            <div className="flex w-full justify-center rounded-md bg-white py-1 shadow-sm">
              <span>O-Hell</span>
            </div>
          </Link>
        </div>
        <div className="w-1/2">
          <Link href={`/hearts`}>
            <div className="flex w-full justify-center rounded-md py-1">
              <span className="text-neutral-500">Hearts</span>
            </div>
          </Link>
        </div>
      </div>
      <h1 className="text-2xl font-bold">O Hell Leaderboard</h1>
      <div className="flex flex-col gap-4 py-4">
        <ParticipantChart
          names={oHell.map((participant: Participant) => participant.name)}
          winPercentages={oHell.map((participant) => participant.percentageWon)}
          height={350}
          width={1000}
        />
        <DataTable columns={columns} data={oHell} />
      </div>
      <div className="flex flex-col gap-4">
        <Link
          href={`/o-hell/games`}
          className="text-primary font-medium underline underline-offset-4"
        >
          Game Log
        </Link>
        <Link
          href={`/admin`}
          className="font-medium text-neutral-500 underline underline-offset-4"
        >
          Admin Page
        </Link>
      </div>
      <div className="pb-4"></div>
    </div>
  );
}
