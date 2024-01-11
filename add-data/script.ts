import { db } from "@/db";

async function main() {
  // Mapping of participant names to their IDs
  interface ParticipantIds {
    [key: string]: number;
    Luke: number;
    Claire: number;
    Jake: number;
    Dad: number;
    Mom: number;
    Sophia: number;
    Alex: number;
    Ashley: number;
    Brad: number;
    Christie: number;
  }

  const participantIds: ParticipantIds = {
    Luke: 1,
    Claire: 2,
    Jake: 3,
    Dad: 4,
    Mom: 5,
    Sophia: 6,
    Alex: 7,
    Ashley: 8,
    Brad: 9,
    Christie: 10,
  };

  const gamesData = [
    {
      date: new Date("2023-12-22T00:00:00.000Z"),
      participants: ["Luke", "Mom", "Dad", "Jake", "Claire"],
      winner: "Luke",
      winnerScore: 168,
      secondPlace: "Mom",
      secondPlaceScore: 159,
      thirdPlace: "Claire",
      thirdPlaceScore: 152,
      gameTypeId: 1, // Replace with the actual game type ID
    },
    {
      date: new Date("2023-12-22T00:00:00.000Z"),
      participants: ["Luke", "Mom", "Dad", "Jake", "Claire"],
      winner: "Mom",
      winnerScore: 166,
      secondPlace: "Claire",
      secondPlaceScore: 150,
      thirdPlace: "Luke",
      thirdPlaceScore: 145,
      gameTypeId: 1, // Replace with the actual game type ID
    },
    {
      date: new Date("2023-12-23T00:00:00.000Z"),
      participants: ["Luke", "Claire", "Dad"],
      winner: "Dad",
      winnerScore: 173,
      secondPlace: "Luke",
      secondPlaceScore: 137,
      thirdPlace: "Claire",
      thirdPlaceScore: 114,
      gameTypeId: 1, // Replace with the actual game type ID
    },
    {
      date: new Date("2023-12-23T00:00:00.000Z"),
      participants: ["Luke", "Claire", "Dad"],
      winner: "Luke",
      winnerScore: 151,
      secondPlace: "Claire",
      secondPlaceScore: 145,
      thirdPlace: "Dad",
      thirdPlaceScore: 143,
      gameTypeId: 1, // Replace with the actual game type ID
    },
    {
      date: new Date("2023-12-24T00:00:00.000Z"),
      participants: ["Luke", "Claire", "Dad", "Jake"],
      winner: "Claire",
      winnerScore: 173,
      secondPlace: "Dad",
      secondPlaceScore: 163,
      thirdPlace: "Luke",
      thirdPlaceScore: 152,
      gameTypeId: 1, // Replace with the actual game type ID
    },
    {
      date: new Date("2023-12-26T00:00:00.000Z"),
      participants: ["Luke", "Dad", "Brad", "Alex", "Christie", "Ashley"],
      winner: "Brad",
      winnerScore: 128,
      secondPlace: "Dad",
      secondPlaceScore: 124,
      thirdPlace: "Luke",
      thirdPlaceScore: 123,
      gameTypeId: 1, // Replace with the actual game type ID
    },
    {
      date: new Date("2023-12-26T00:00:00.000Z"),
      participants: ["Luke", "Dad", "Brad", "Alex", "Christie", "Ashley"],
      winner: "Luke",
      winnerScore: 135,
      secondPlace: "Brad",
      secondPlaceScore: 133,
      thirdPlace: "Christie",
      thirdPlaceScore: 109,
      gameTypeId: 1, // Replace with the actual game type ID
    },
    {
      date: new Date("2023-12-27T00:00:00.000Z"),
      participants: ["Brad", "Dad", "Luke", "Alex"],
      winner: "Dad",
      winnerScore: 172,
      secondPlace: "Luke",
      secondPlaceScore: 166,
      thirdPlace: "Alex",
      thirdPlaceScore: 132,
      gameTypeId: 1, // Replace with the actual game type ID
    },
    {
      date: new Date("2023-12-29T00:00:00.000Z"),
      participants: [
        "Luke",
        "Dad",
        "Brad",
        "Alex",
        "Christie",
        "Ashley",
        "Claire",
      ],
      winner: "Christie",
      winnerScore: 115,
      secondPlace: "Alex",
      secondPlaceScore: 114,
      thirdPlace: "Mom",
      thirdPlaceScore: 111,
      gameTypeId: 1, // Replace with the actual game type ID
    },
    {
      date: new Date("2023-12-29T00:00:00.000Z"),
      participants: ["Luke", "Dad", "Alex", "Christie", "Ashley"],
      winner: "Ashley",
      winnerScore: 107,
      secondPlace: "Dad",
      secondPlaceScore: 97,
      thirdPlace: "Christie",
      thirdPlaceScore: 96,
      gameTypeId: 1, // Replace with the actual game type ID
    },
    {
      date: new Date("2024-01-01T00:00:00.000Z"),
      participants: ["Luke", "Sophia", "Dad", "Jake"],
      winner: "Dad",
      winnerScore: 155,
      secondPlace: "Jake",
      secondPlaceScore: 148,
      thirdPlace: "Sophia",
      thirdPlaceScore: 143,
      gameTypeId: 1, // Replace with the actual game type ID
    },
    {
      date: new Date("2024-01-01T00:00:00.000Z"),
      participants: ["Luke", "Sophia", "Dad", "Jake"],
      winner: "Sophia",
      winnerScore: 164,
      secondPlace: "Jake",
      secondPlaceScore: 160,
      thirdPlace: "Luke",
      thirdPlaceScore: 122,
      gameTypeId: 1, // Replace with the actual game type ID
    },
    {
      date: new Date("2024-01-02T00:00:00.000Z"),
      participants: ["Luke", "Sophia", "Dad", "Jake"],
      winner: "Luke",
      winnerScore: 195,
      secondPlace: "Dad",
      secondPlaceScore: 150,
      thirdPlace: "Sophia",
      thirdPlaceScore: 134,
      gameTypeId: 1, // Replace with the actual game type ID
    },
  ];

  // Make sure the enclosing function is async
  async function createGames() {
    for (const gameData of gamesData) {
      const newGame = await db.game.create({
        data: {
          date: gameData.date,
          participants: {
            connect: gameData.participants.map((name) => ({
              id: participantIds[name],
            })),
          },
          winner: {
            connect: { id: participantIds[gameData.winner] },
          },
          winnerScore: gameData.winnerScore,
          secondPlace: {
            connect: { id: participantIds[gameData.secondPlace] },
          },
          secondPlaceScore: gameData.secondPlaceScore,
          thirdPlace: {
            connect: { id: participantIds[gameData.thirdPlace] },
          },
          thirdPlaceScore: gameData.thirdPlaceScore,
          type: {
            connect: { id: gameData.gameTypeId },
          },
        },
      });

      console.log(gameData);
    }
  }

  createGames();
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
