"use client"

import LogGameModal from "@/sections/log-game/log-game-modal"
import { Pencil, Trash2 } from "lucide-react"
import { Fragment, useEffect, useState } from "react"
import { deleteGame, getGamePlayerScores, getGamesWithDetails, type GameDetailsDTO, type GamePlayerScoreDTO } from "./gameLogActions"

interface GameLogProps {
  isSignedIn?: boolean
}

export default function GameLog({ isSignedIn = false }: GameLogProps) {
  const [games, setGames] = useState<GameDetailsDTO[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedGameId, setExpandedGameId] = useState<number | null>(null)
  const [playerScores, setPlayerScores] = useState<Record<number, GamePlayerScoreDTO[]>>({})
  const [loadingScores, setLoadingScores] = useState<number | null>(null)
  const [deletingGameId, setDeletingGameId] = useState<number | null>(null)
  const [editingGameId, setEditingGameId] = useState<number | null>(null)
  const pageSize = 10

  useEffect(() => {
    getGamesWithDetails(currentPage, pageSize).then(setGames)
  }, [currentPage])

  useEffect(() => {
    const handleGameLogged = () => {
      getGamesWithDetails(currentPage, pageSize).then(setGames)
    }
    window.addEventListener('gameLogged', handleGameLogged)
    return () => window.removeEventListener('gameLogged', handleGameLogged)
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

  const handleDeleteGame = async (gameId: number) => {
    if (!confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      return
    }

    setDeletingGameId(gameId)
    try {
      const result = await deleteGame(gameId)
      if (result.success) {
        // Remove the game from the list
        setGames(prev => prev.filter(game => game.gameId !== gameId))
        // Remove player scores for this game
        setPlayerScores(prev => {
          const newScores = { ...prev }
          delete newScores[gameId]
          return newScores
        })
        // If the deleted game was expanded, close it
        if (expandedGameId === gameId) {
          setExpandedGameId(null)
        }
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('gameLogged'))
      } else {
        alert(result.error || 'Failed to delete game')
      }
    } catch (error) {
      alert('Failed to delete game')
    } finally {
      setDeletingGameId(null)
    }
  }

  const formatDate = (dateStr: string): string => {
    try {
      // Force local date parsing
      const [y, m, d] = dateStr.split('-').map(Number)
      const date = new Date(y, m - 1, d)

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const month = months[date.getMonth()]
      const day = date.getDate()
      const year = String(date.getFullYear()).slice(-2)

      return `${month} ${day} '${year}`
    } catch {
      return dateStr
    }
  }

  return (
    <div className="mt-12 pb-12">
      <h1 className="text-base font-bold mb-4">Game Log</h1>
      <div className="overflow-x-auto overflow-y-auto max-h-[600px] hidden sm:block">
        <table className="w-full table-fixed">
          <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
            <tr className="text-left text-xs text-neutral-500 border-b border-neutral-100">
              <th className="pb-1 font-medium w-24">Date</th>
              <th className="pb-1 font-medium w-36">Location</th>
              <th className="pb-1 font-medium w-auto">Message</th>
              <th className="pb-1 text-right font-medium w-20 pr-4">Players</th>
              <th className="pb-1 font-medium w-32 pl-4">Winner</th>
              <th className="pb-1 font-medium w-20 pl-4">Scores</th>
              {isSignedIn && <th className="pb-1 font-medium w-16 pl-4">Actions</th>}
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
                    <td className="py-1">{formatDate(game.gameDate)}</td>
                    <td className="py-1">{game.gameLocation}</td>
                    <td className="py-1">{game.gameMessage || '-'}</td>
                    <td className="py-1 text-right text-neutral-700 pr-4">{game.playerCount}</td>
                    <td className="py-1 pl-4">
                      {game.winnerName ? (
                        <span>
                          {game.winnerName}{' '}
                          <span className="text-neutral-500 text-xs">{game.winnerScore}</span>
                        </span>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="py-1 pl-4">
                      <button
                        onClick={() => handleToggleDetails(game.gameId)}
                        className="text-xs text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
                      >
                        {isExpanded ? 'Hide' : 'Show'}
                      </button>
                    </td>
                    {isSignedIn && (
                      <td className="py-1 pl-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingGameId(game.gameId)}
                            className="text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer"
                            title="Edit game"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteGame(game.gameId)}
                            disabled={deletingGameId === game.gameId}
                            className="text-neutral-500 hover:text-red-700 disabled:text-neutral-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            title="Delete game"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td colSpan={isSignedIn ? 7 : 6} className="py-3 px-4 bg-neutral-50">
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

      <div className="sm:hidden space-y-3 overflow-y-auto max-h-[600px]">
        {games.map((game) => {
          const isExpanded = expandedGameId === game.gameId
          const scores = playerScores[game.gameId] || []
          const isLoading = loadingScores === game.gameId

          return (
            <div
              key={game.gameId}
              className="border border-neutral-200 rounded-md p-3 bg-white"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-neutral-900">
                  {formatDate(game.gameDate)}
                </span>

                {isSignedIn && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingGameId(game.gameId)}
                      className="text-neutral-600 hover:text-neutral-900 active:text-neutral-700 transition-colors p-1.5 rounded-md hover:bg-neutral-100 active:bg-neutral-200"
                      title="Edit game"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteGame(game.gameId)}
                      disabled={deletingGameId === game.gameId}
                      className="text-neutral-600 hover:text-red-700 active:text-red-800 disabled:text-neutral-300 disabled:cursor-not-allowed transition-colors p-1.5 rounded-md hover:bg-red-50 active:bg-red-100"
                      title="Delete game"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-xs text-neutral-700 mb-0.5 truncate">
                {game.gameLocation}
              </div>

              <div className="text-xs text-neutral-600 mb-1 truncate">
                {game.gameMessage || '-'}
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-700 mb-2">
                <span>{game.playerCount} players</span>
                <span>
                  Winner: {game.winnerName ? (
                    <>
                      {game.winnerName}{' '}
                      <span className="text-neutral-500">{game.winnerScore}</span>
                    </>
                  ) : (
                    <span className="text-neutral-400">-</span>
                  )}
                </span>
              </div>

              <button
                onClick={() => handleToggleDetails(game.gameId)}
                className="text-xs text-neutral-600 hover:text-neutral-900 underline"
              >
                {isExpanded ? "Hide" : "Show Scores"}
              </button>

              {isExpanded && (
                <div className="mt-2 border-t border-neutral-200 pt-2">
                  <h3 className="text-xs font-medium text-neutral-900 mb-1">Player Scores</h3>

                  {isLoading ? (
                    <div className="text-xs text-neutral-500">Loading...</div>
                  ) : scores.length > 0 ? (
                    <div className="space-y-1">
                      {scores.map((player) => (
                        <div key={player.playerId} className="flex justify-between text-xs">
                          <span className="text-neutral-700">{player.playerName}</span>
                          <span className="text-neutral-900 font-medium">{player.score}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-500">No scores available</div>
                  )}

                  {game.gameImageUrl && (
                    <div className="mt-3">
                      <h3 className="text-xs font-medium text-neutral-900 mb-1">Game Image</h3>
                      <span className="text-xs text-neutral-500 break-all">{game.gameImageUrl}</span>
                    </div>
                  )}

                  {game.scoreImageUrl && (
                    <div className="mt-3">
                      <h3 className="text-xs font-medium text-neutral-900 mb-1">Score Sheet</h3>
                      <span className="text-xs text-neutral-500 break-all">{game.scoreImageUrl}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="text-xs text-neutral-600 hover:text-neutral-900 disabled:text-neutral-400 disabled:cursor-not-allowed cursor-pointer"
        >
          Previous
        </button>
        <span className="text-xs text-neutral-600">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={games.length < pageSize}
          className="text-xs text-neutral-600 hover:text-neutral-900 disabled:text-neutral-400 disabled:cursor-not-allowed cursor-pointer"
        >
          Next
        </button>
      </div>

      {isSignedIn && (
        <LogGameModal
          isOpen={editingGameId !== null}
          onClose={() => setEditingGameId(null)}
          gameId={editingGameId || undefined}
        />
      )}
    </div>
  )
}

