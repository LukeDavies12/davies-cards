import { db } from "@/db";
import { DataTable } from './participants/data-table';
import { columns } from './participants/columns';
import { HeartsDataTable } from "./heartsParticipants/data-table";
import { heartsColumns } from "./heartsParticipants/columns";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from 'next/router'

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

  // Sort participants by win percentage in descending order and assign rank/place
  participantsWithStats = participantsWithStats.sort((a, b) => parseFloat(b.percentageWon) - parseFloat(a.percentageWon))
    .map((participant) => ({
      ...participant,
    }));

  return participantsWithStats;
}

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


export default async function Home() {
  const oHell = await getParticipants();
  const hearts = await getHeartsParticipants();

  return (
    <div>
      <Tabs defaultValue="o-hell" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-11">
          <TabsTrigger value="o-hell" className="py-2">O-Hell Leaderboard</TabsTrigger>
          <TabsTrigger value="hearts" className="py-2">Hearts Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value="o-hell">
          <div className="py-4">
            <DataTable columns={columns} data={oHell} />
          </div>
          <Link href={`/o-hell`} className="font-medium text-primary underline underline-offset-4">Game Log</Link>
        </TabsContent>
        <TabsContent value="hearts">
            <div className="py-4">
              <HeartsDataTable columns={heartsColumns} data={hearts} />
            </div>
            <Link href={`/hearts`} className="font-medium text-primary underline underline-offset-4">Game Log</Link>
        </TabsContent>
      </Tabs>
    </div>
  )
}
