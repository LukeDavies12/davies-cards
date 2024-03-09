import { auth } from "@/auth/lucia";
import { db } from "@/db";
import * as context from "next/headers";
import { redirect } from "next/navigation";
import { GamesWithParticipantsandType, columns } from "./columns";
import { DataTable } from "./data-table";

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
    include: {
      participants: true,
      winner: true, // Include the winner
      secondPlace: true, // Include the second place
      thirdPlace: true, // Include the third place
      type: true,
    },
  });

  let gamesWithParticipantsandType: GamesWithParticipantsandType[] = games.map(
    (game: any) => {
      return {
        ...game,
        participants: game.participants
          .map((participant: any) => participant.name)
          .join(", "),
        winner: game.winner?.name || "",
        secondPlace: game.secondPlace?.name || "",
        thirdPlace: game.thirdPlace?.name || "",
        dateString: formatDate(game.date),
        gameTypeName: game.type.name || "",
      };
    },
  );

  // Sort games by date
  gamesWithParticipantsandType.sort((a: any, b: any) => {
    const dateA = new Date(a.dateString);
    const dateB = new Date(b.dateString);
    return dateB.getTime() - dateA.getTime();
  });

  return gamesWithParticipantsandType;
}

export default async function Page() {
  const authRequest = auth.handleRequest("GET", context);
  const session = await authRequest.validate();
  if (!session) redirect("/login");

  const data = await getGames();

  return (
    <div>
      <h1 className="text-2xl font-bold">All Games</h1>
      <div className="py-4">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
