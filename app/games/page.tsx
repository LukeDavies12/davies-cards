import { db } from "@/db"
import { DataTable } from "./data-table"
import { GamesWithParticipants, columns } from "./columns"

function formatDate(dateString: string | number | Date) {
  const date = new Date(dateString);
  
  const month = date.toLocaleString('en-US', { month: 'short' }); // abbreviated month name
  const day = date.getDate(); // numeric day of the month
  const year = date.getFullYear().toString().substr(-2); // last two digits of the year

  return `${month} ${day} '${year}`;
}

async function getGames() {
  const games = await db.game.findMany({
    include: {
      participants: true,
      winner: true, // Include the winner
      secondPlace: true, // Include the second place
      thirdPlace: true, // Include the third place
    },
  });

  let gamesWithParticipants = games.map((game) => {
    return {
      ...game,
      participants: game.participants.map(p => ({ name: p.name })),
      winner: game.winner?.name || '', // Convert to string
      secondPlace: game.secondPlace?.name || '', // Convert to string
      thirdPlace: game.thirdPlace?.name || '', // Convert to string
      dateString: formatDate(game.date),
    };
  });

  // Sort games by date
  gamesWithParticipants.sort((a, b) => {
    const dateA = new Date(a.dateString);
    const dateB = new Date(b.dateString);
    return  dateB.getTime() - dateA.getTime();
  });

  return gamesWithParticipants;
}



export default async function Page() {
  const data = await getGames();

  return (
    <div>
      <h1 className="text-2xl font-bold">O-Hell Games</h1>
      <div className="py-4">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}