import { db } from "@/db";
import { heartsColumns } from "../columns";
import { HeartsDataTable } from "../data-table";

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

async function getHeartsGames() {
  // Fetch games with a specific gameTypeId, and include participants and places.
  const games = await db.game.findMany({
    where: {
      gameTypeId: 2, // Hearts games
    },
    include: {
      participants: true, // Include all participants of the game
      winner: true, // Include the winner of the game
      secondPlace: true, // Include the second-place participant
      thirdPlace: true, // Include the third-place participant
    },
  });

  let gamesWithFormattedDetails = games.map((game) => ({
    ...game,
    participants: game.participants.map((p) => p.name).join(", "), // Concatenate participant names
    winner: game.winner?.name || "",
    secondPlace: game.secondPlace?.name || "",
    thirdPlace: game.thirdPlace?.name || "",
    dateString: formatDate(game.date),
  }));

  // Sort games by date, assuming dateString is in a sortable format
  gamesWithFormattedDetails.sort(
    (a, b) =>
      new Date(b.dateString).getTime() - new Date(a.dateString).getTime(),
  );

  return gamesWithFormattedDetails;
}

export async function Page() {
  const data = await getHeartsGames();

  // Assuming HeartsDataTable and heartsColumns are defined elsewhere in your codebase.
  return (
    <div>
      <h1 className="text-2xl font-bold">Hearts Games</h1>
      <div className="py-4">
        <HeartsDataTable columns={heartsColumns} data={data} />
      </div>
    </div>
  );
}
