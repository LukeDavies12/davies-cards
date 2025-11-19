"use client"

import { Fragment, useEffect, useState } from "react"
import { getGamePlayerScores, getGamesWithDetails, type GameDetailsDTO, type GamePlayerScoreDTO } from "./gameLogActions"

export default function GameLog() {
  const [games, setGames] = useState<GameDetailsDTO[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedGameId, setExpandedGameId] = useState<number | null>(null)
  const [playerScores, setPlayerScores] = useState<Record<number, GamePlayerScoreDTO[]>>({})
  const [loadingScores, setLoadingScores] = useState<number | null>(null)
  const pageSize = 10

  useEffect(() => {
    getGamesWithDetails(currentPage, pageSize).then(setGames)
  }, [currentPage])

  const handleToggleDetails = async (gameId: number) => {
    if (expandedGameId === gameId) {
      setExpandedGameId(null)
    } else {
      setExpandedGameId(gameId)
      if (!playerScores[gameId]) {
        setLoadingScores(gameId)
        const scores = await getGamePlayerScores(gameId)
        setPlayerScores(prev => ({ ...prev, [gameId]: scores }))
        setLoadingScores(null)
      }
    }
  }

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

  return (
    <div className="mt-12">
      <h1 className="text-base font-bold mb-4">Game Log</h1>
      <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
        <table className="w-full table-fixed">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-left text-xs text-neutral-500 border-b border-neutral-200">
              <th className="pb-1.5 font-medium w-28">Date</th>
              <th className="pb-1.5 font-medium w-40">Location</th>
              <th className="pb-1.5 font-medium w-auto">Message</th>
              <th className="pb-1.5 text-right font-medium w-24 pr-4">Players</th>
              <th className="pb-1.5 font-medium w-40 pl-4">Winner</th>
              <th className="pb-1.5 font-medium w-24 pl-4">Scores</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => {
              const isExpanded = expandedGameId === game.gameId
              const scores = playerScores[game.gameId] || []
              const isLoading = loadingScores === game.gameId

              return (
                <Fragment key={game.gameId}>
                  <tr className="text-sm border-b border-neutral-100">
                    <td className="py-1.5">{formatDate(game.gameDate)}</td>
                    <td className="py-1.5">{game.gameLocation}</td>
                    <td className="py-1.5">{game.gameMessage || '-'}</td>
                    <td className="py-1.5 text-right text-neutral-600 pr-4">{game.playerCount}</td>
                    <td className="py-1.5 pl-4">
                      {game.winnerName ? (
                        <span>{game.winnerName} <span className="text-neutral-500 text-xs">{game.winnerScore}</span></span>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="py-1.5 pl-4">
                      <button
                        onClick={() => handleToggleDetails(game.gameId)}
                        className="text-xs text-neutral-600 hover:text-neutral-900 underline"
                      >
                        {isExpanded ? 'Hide' : 'Show'}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${game.gameId}-details`}>
                      <td colSpan={6} className="py-3 px-4 bg-neutral-50">
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-xs font-medium text-neutral-900 mb-2">Player Scores</h3>
                            <div className="space-y-1">
                              {isLoading ? (
                                <div className="text-xs text-neutral-500">Loading...</div>
                              ) : scores.length > 0 ? (
                                scores.map((player) => (
                                  <div key={player.playerId} className="flex items-center justify-between text-xs">
                                    <span className="text-neutral-700">{player.playerName}</span>
                                    <span className="text-neutral-900 font-medium">{player.score}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-xs text-neutral-500">No scores available</div>
                              )}
                            </div>
                          </div>
                          {game.gameImageUrl && (
                            <div>
                              <h3 className="text-xs font-medium text-neutral-900 mb-1">Game Image</h3>
                              <span className="text-xs text-neutral-500">{game.gameImageUrl}</span>
                            </div>
                          )}
                          {game.scoreImageUrl && (
                            <div>
                              <h3 className="text-xs font-medium text-neutral-900 mb-1">Score Sheet</h3>
                              <span className="text-xs text-neutral-500">{game.scoreImageUrl}</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="text-sm text-neutral-600 hover:text-neutral-900 disabled:text-neutral-400 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-neutral-600">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={games.length < pageSize}
          className="text-sm text-neutral-600 hover:text-neutral-900 disabled:text-neutral-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}

