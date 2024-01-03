import Image from 'next/image'
import prisma from "@/utils/prisma"

export default async function Home() {
  const games = await prisma.game.findMany();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {games.map((game) => (
        <div key={game.id} className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">{game.date.toDateString()}</h1>
        </div>
      ))}
    </main>
  )
}
