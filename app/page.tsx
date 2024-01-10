import prisma from "@/utils/prisma";
import { Participant, Game } from '@prisma/client';
import { DataTable } from './participants/data-table';
import { ParticipantWithStats, columns } from './participants/columns';

async function getParticipants() {
  const participants = await prisma.participant.findMany({
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
      <div className="py-4">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
