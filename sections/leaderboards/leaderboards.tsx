"use client"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useState } from "react"
import { getWinStatsData, type PlayerWinStatsDTO } from "./leaderboardActions"

type SortKey = keyof PlayerWinStatsDTO
type SortDirection = "asc" | "desc"

export default function Leaderboard() {
  const [minGames, setMinGames] = useState(7)
  const [inputValue, setInputValue] = useState("7")
  const [data, setData] = useState<PlayerWinStatsDTO[]>([])
  const [sortKey, setSortKey] = useState<SortKey>("winPercentage")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  useEffect(() => {
    const storedMinGames = localStorage.getItem("minGamesPlayed")
    const storedSort = localStorage.getItem("leaderboardSort")

    if (storedMinGames) {
      const num = Number.parseInt(storedMinGames, 10)
      setMinGames(num)
      setInputValue(storedMinGames)
    }

    if (storedSort) {
      try {
        const { key, direction } = JSON.parse(storedSort)
        setSortKey(key)
        setSortDirection(direction)
      } catch (e) {
        // Invalid JSON, ignore
      }
    }
  }, [])

  useEffect(() => {
    if (minGames >= 0) {
      localStorage.setItem("minGamesPlayed", minGames.toString())
      getWinStatsData({ minGamesPlayed: minGames }).then(setData)
    }
  }, [minGames])

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

  const SortButton = ({ column, label, align = "left" }: { column: SortKey; label: string; align?: "left" | "right" }) => {
    const isActive = sortKey === column
    return (
      <button
        onClick={() => handleSort(column)}
        className={`flex items-center gap-1 hover:text-gray-900 transition-colors ${align === "right" ? "ml-auto" : ""}`}
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
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">O-hell Leaderboard</h1>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Min Games</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-16 px-2 py-1 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-900"
              min="0"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                <th className="pb-1.5 font-medium w-auto">
                  <SortButton column="playerName" label="Player" />
                </th>
                <th className="pb-1.5 text-right font-medium w-24">
                  <SortButton column="gamesPlayed" label="Games" align="right" />
                </th>
                <th className="pb-1.5 text-right font-medium w-20">
                  <SortButton column="wins" label="Wins" align="right" />
                </th>
                <th className="pb-1.5 text-right font-medium w-24">
                  <SortButton column="winPercentage" label="Win %" align="right" />
                </th>
                <th className="pb-1.5 text-right font-medium w-40">
                  <SortButton column="avgPointsFromWin" label="Avg Pts from Win" align="right" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((player) => (
                <tr key={player.playerId} className="text-sm border-b border-gray-100">
                  <td className="py-1.5">{player.playerName}</td>
                  <td className="py-1.5 text-right text-gray-600">{player.gamesPlayed}</td>
                  <td className="py-1.5 text-right text-gray-600">{player.wins}</td>
                  <td className="py-1.5 text-right text-gray-600">{player.winPercentage}%</td>
                  <td className="py-1.5 text-right text-gray-600">{player.avgPointsFromWin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}