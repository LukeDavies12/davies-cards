"use client"

import { useEffect, useState } from "react"
import { getTopScoresByPlayerCount, type TopScoreByPlayerCountDTO } from "./topScoreActions"

type GroupedScores = {
  playerCount: number
  scores: Array<{
    score: number
    players: string[]
    gameDate: string
    gameLocation: string
  }>
}

export default function TopScore() {
  const [data, setData] = useState<TopScoreByPlayerCountDTO[]>([])

  useEffect(() => {
    getTopScoresByPlayerCount().then((result) => {
      setData(result)
    })
  }, [])

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const month = months[date.getMonth()]
      const day = date.getDate()
      const year = date.getFullYear().toString().slice(-2)
      return `${month} ${day} '${year}`
    } catch {
      return dateStr
    }
  }

  // Group scores by player count and handle ties
  const groupedScores = data.reduce((acc, item) => {
    const existing = acc.find((g) => g.playerCount === item.playerCount)

    // Convert date to string if it's a Date object
    const gameDateStr = item.gameDate && typeof item.gameDate === 'object' && 'toISOString' in item.gameDate
      ? (item.gameDate as Date).toISOString().split('T')[0]
      : String(item.gameDate)

    if (existing) {
      // Check if this score already exists (same score, same game)
      const scoreGroup = existing.scores.find(
        (s) => s.score === item.score &&
          s.gameDate === gameDateStr &&
          s.gameLocation === item.gameLocation
      )
      if (scoreGroup) {
        // Add player if not already in the list
        if (!scoreGroup.players.includes(item.playerName)) {
          scoreGroup.players.push(item.playerName)
        }
      } else {
        // New unique score entry
        existing.scores.push({
          score: item.score,
          players: [item.playerName],
          gameDate: gameDateStr,
          gameLocation: item.gameLocation,
        })
      }
    } else {
      acc.push({
        playerCount: item.playerCount,
        scores: [{
          score: item.score,
          players: [item.playerName],
          gameDate: gameDateStr,
          gameLocation: item.gameLocation,
        }],
      })
    }

    return acc
  }, [] as GroupedScores[])

  // Sort by player count and limit to top 5 scores per group
  groupedScores.sort((a, b) => a.playerCount - b.playerCount)
  groupedScores.forEach((group) => {
    group.scores.sort((a, b) => b.score - a.score)
    group.scores = group.scores.slice(0, 5)
  })

  return (
    <div className="mt-8 overflow-y-auto max-h-[600px]">
      <h1 className="text-xl font-bold mb-4">Top Score by # of Players</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {groupedScores.map((group) => (
          <div key={group.playerCount}>
            <h2 className="font-medium text-neutral-900 mb-1">
              {group.playerCount} {group.playerCount === 1 ? "Player" : "Players"}
            </h2>
            <div className="space-y-1">
              {group.scores.map((scoreItem, index) => (
                <div key={index} className="flex items-start justify-between gap-2 text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="text-neutral-700 font-medium truncate">
                      {scoreItem.players.join(" / ")}
                    </div>
                    <div className="text-neutral-900 text-xs truncate">
                      {formatDate(scoreItem.gameDate)} <span className="text-neutral-500">{scoreItem.gameLocation}</span>
                    </div>
                  </div>
                  <div className="text-neutral-900 font-semibold whitespace-nowrap">
                    {scoreItem.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

