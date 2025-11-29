"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { getWinStatsData, type PlayerWinStatsDTO } from "./leaderboardActions"

type SortKey = keyof PlayerWinStatsDTO
type SortDirection = "asc" | "desc"

export default function Leaderboard() {
  const [minGames, setMinGames] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [data, setData] = useState<PlayerWinStatsDTO[]>([])
  const [sortKey, setSortKey] = useState<SortKey>("winPercentage")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [isInitialized, setIsInitialized] = useState(false)
  const lastQueryParams = useRef<{ minGamesPlayed: number } | null>(null)

  useEffect(() => {
    const storedMinGames = localStorage.getItem("minGamesPlayed")
    const storedSort = localStorage.getItem("leaderboardSort")

    if (storedMinGames) {
      const num = Number.parseInt(storedMinGames, 10)
      setMinGames(num)
      setInputValue(storedMinGames)
    } else {
      setMinGames(7)
      setInputValue("7")
    }

    if (storedSort) {
      const { key, direction } = JSON.parse(storedSort)
      setSortKey(key)
      setSortDirection(direction)
    }

    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized && minGames !== null && minGames >= 0) {
      const queryParams = { minGamesPlayed: minGames }

      // Only query if the parameters have changed
      if (
        !lastQueryParams.current ||
        lastQueryParams.current.minGamesPlayed !== queryParams.minGamesPlayed
      ) {
        lastQueryParams.current = queryParams
        localStorage.setItem("minGamesPlayed", minGames.toString())
        getWinStatsData(queryParams).then(setData)
      }
    }
  }, [minGames, isInitialized])

  const handleInputChange = (value: string) => {
    setInputValue(value)
    const parsed = Number.parseInt(value, 10)
    if (!isNaN(parsed) && parsed >= 0) {
      setMinGames(parsed)
    }
  }

  const handleSort = (key: SortKey) => {
    let newDirection: SortDirection = "desc"
    if (sortKey === key) {
      newDirection = sortDirection === "asc" ? "desc" : "asc"
    }
    setSortKey(key)
    setSortDirection(newDirection)
    localStorage.setItem("leaderboardSort", JSON.stringify({ key, direction: newDirection }))
  }

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    const multiplier = sortDirection === "asc" ? 1 : -1

    if (typeof aVal === "string" && typeof bVal === "string") {
      const aNum = parseFloat(aVal)
      const bNum = parseFloat(bVal)
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return (aNum - bNum) * multiplier
      }
      return aVal.localeCompare(bVal) * multiplier
    }
    return ((aVal as number) - (bVal as number)) * multiplier
  })

  const topWinPercentages = [...data]
    .sort((a, b) => b.winPercentage - a.winPercentage)
    .reduce((acc, player) => {
      const existing = acc.find((item) => item.value === player.winPercentage)
      if (existing) {
        existing.names.push(player.playerName)
      } else {
        acc.push({ value: player.winPercentage, names: [player.playerName] })
      }
      return acc
    }, [] as { value: number; names: string[] }[])
    .slice(0, 5)

  const maxWinPercentage = topWinPercentages[0]?.value || 100

  const topLowestAvgPoints = [...data]
    .sort((a, b) => a.avgPointsFromWin - b.avgPointsFromWin)
    .slice(0, 5)
    .reduce((acc, player) => {
      const existing = acc.find((item) => item.value === player.avgPointsFromWin)
      if (existing) {
        existing.names.push(player.playerName)
      } else {
        acc.push({ value: player.avgPointsFromWin, names: [player.playerName] })
      }
      return acc
    }, [] as { value: number; names: string[] }[])
    .slice(0, 5)

  const minAvgPoints = topLowestAvgPoints[0]?.value || 0
  const maxAvgPoints = topLowestAvgPoints[topLowestAvgPoints.length - 1]?.value || 1
  const avgPointsRange = maxAvgPoints - minAvgPoints || 1

  const SortButton = ({ column, label, align = "left" }: { column: SortKey; label: string; align?: "left" | "right" }) => {
    const isActive = sortKey === column
    return (
      <button
        onClick={() => handleSort(column)}
        className={`flex items-center gap-1 hover:text-neutral-900 transition-colors ${align === "right" ? "ml-auto" : ""}`}
      >
        {label}
        <span className="w-3 h-3 inline-flex items-center justify-center">
          {isActive && (
            sortDirection === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
          )}
        </span>
      </button>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-base font-bold">O-hell Leaderboard</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-600">Min Games</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-16 px-2 py-1 text-sm bg-neutral-100 rounded-xs hover:bg-neutral-200 focus:bg-neutral-300 focus:outline-none transition-colors ease-linear duration-100"
            min="0"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">

        <div>
          <h2 className="text-sm font-medium text-neutral-900 mb-3">Top 5 Win %</h2>
          <div className="space-y-2">
            {topWinPercentages.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-600">{item.names.join(" / ")}</span>
                    <span className="text-xs font-medium text-neutral-700">{item.value}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2">
                    <div
                      className="bg-red-600 h-2 rounded-xs"
                      style={{ width: `${(item.value / maxWinPercentage) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-neutral-900 mb-3">Top 5 Lowest Avg Pts from Win</h2>
          <div className="space-y-2">
            {topLowestAvgPoints.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-600">{item.names.join(" / ")}</span>
                    <span className="text-xs font-medium text-neutral-700">{item.value}</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2">
                    <div
                      className="bg-neutral-600 h-2 rounded-xs"
                      style={{ width: `${((maxAvgPoints - item.value) / avgPointsRange) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[280px]">
        <table className="w-full table-fixed">
          <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
            <tr className="text-left text-xs text-neutral-500 border-b border-neutral-200">
              <th className="pb-1 font-medium w-auto">
                <SortButton column="playerName" label="Player" />
              </th>
              <th className="pb-1 text-right font-medium w-20">
                <SortButton column="gamesPlayed" label="Games" align="right" />
              </th>
              <th className="pb-1 text-right font-medium w-16">
                <SortButton column="wins" label="Wins" align="right" />
              </th>
              <th className="pb-1 text-right font-medium w-20">
                <SortButton column="winPercentage" label="Win %" align="right" />
              </th>
              <th className="pb-1 text-right font-medium w-32">
                <SortButton column="avgPointsFromWin" label="Avg Pts from Win" align="right" />
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map((player) => (
              <tr key={player.playerId} className="text-sm border-b border-neutral-100">
                <td className="py-1">{player.playerName}</td>
                <td className="py-1 text-right text-neutral-700">{player.gamesPlayed}</td>
                <td className="py-1 text-right text-neutral-700">{player.wins}</td>
                <td className="py-1 text-right text-neutral-700">{player.winPercentage}%</td>
                <td className="py-1 text-right text-neutral-700">{player.avgPointsFromWin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}