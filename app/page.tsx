import prisma from "@/utils/prisma";
import { Participant, Game } from '@prisma/client';
import { DataTable } from './participants/data-table';
import { ParticipantWithStats, columns } from './participants/columns';

async function getParticipants() {
  const participants = await prisma.participant.findMany({
    include: {
      games: true,
    },
  });

  const participantsWithStats = participants.map((participant) => {
    const gamesWon = participant.games.filter((game) => game.winnerId === participant.id).length;
    const percentageWon = (gamesWon / participant.games.length * 100).toFixed(1) + '%'; // Format the number

    return {
      ...participant,
      games: participant.games.length,
      gamesWon,
      percentageWon, // This is now a string like '38.8%'
    };
  });

  return participantsWithStats.sort((a, b) => parseFloat(b.percentageWon) - parseFloat(a.percentageWon));
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
