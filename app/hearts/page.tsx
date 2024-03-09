import { db } from "@/db";
import Link from "next/link";
import { heartsColumns } from "../heartsParticipants/columns";
import { HeartsDataTable } from "../heartsParticipants/data-table";
import dynamic from "next/dynamic";
import { Participant } from "@prisma/client";
import SwitchCharts from "@/components/participants/SwitchCharts";

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
      percentageWon,
      percentageWonString,
      totalPoints,
    };
  });

  participantsWithStats = participantsWithStats.filter(
    (p) => p.gamesPlayed > 0,
  );

  participantsWithStats = participantsWithStats
    .sort((a: any, b: any) => b.percentageWon - a.percentageWon)
    .map((participant) => ({
      ...participant,
    }));

  return participantsWithStats;
}

export default async function Page() {
  const hearts = await getHeartsParticipants();

  return (
    <div>
      <div className="bg mb-4 flex rounded-md bg-neutral-100 p-1">
        <div className="w-1/2">
          <Link href={`/`}>
            <div className="flex w-full justify-center rounded-md py-1">
              <span className="text-neutral-500">O-Hell</span>
            </div>
          </Link>
        </div>
        <div className="w-1/2">
          <Link href={`/hearts`}>
            <div className="flex w-full justify-center rounded-md bg-white py-1 shadow-sm">
              <span>Hearts</span>
            </div>
          </Link>
        </div>
      </div>
      <h1 className="text-2xl font-bold">Hearts Leaderboard</h1>
      <div className="flex flex-col gap-4 py-4">
        <SwitchCharts
          percNames={hearts.map((p: Participant) => p.name)}
          winPercentages={hearts.map((p) => p.percentageWon)}
          pointsNames={hearts.map((p: Participant) => p.name)}
          points={hearts.map((p) => p.totalPoints)}
        />
        <HeartsDataTable columns={heartsColumns} data={hearts} />
      </div>
      <div className="flex flex-col gap-4">
        <Link
          href={`/hearts/games`}
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
