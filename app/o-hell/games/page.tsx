import { db } from "@/db";
import { columns } from "../columns";
import { DataTable } from "../data-table";
import { Game } from "@prisma/client";

function formatDate(dateString: string | Date | number) {
  const date = new Date(dateString);

  const month = date.getUTCMonth(); // Get month as a number (0-11)
  const day = date.getUTCDate(); // Get day of the month (1-31)
  const year = date.getUTCFullYear(); // Get full year in YYYY format

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedMonth = monthNames[month]; // Get month name from array

  return `${formattedMonth} ${day} '${year.toString().substr(-2)}`;
}

async function getGames() {
  const games = await db.game.findMany({
    where: {
      gameTypeId: 1,
    },
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
      participants: game.participants.map((p) => p.name).join(", "), // Concatenate participant names
      winner: game.winner?.name || "", // Convert to string
      secondPlace: game.secondPlace?.name || "", // Convert to string
      thirdPlace: game.thirdPlace?.name || "", // Convert to string
      dateString: formatDate(game.date),
    };
  });

  // Sort games by date
  gamesWithParticipants.sort((a: any, b: any) => {
    const dateA = new Date(a.dateString);
    const dateB = new Date(b.dateString);
    return dateB.getTime() - dateA.getTime();
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
  );
}
