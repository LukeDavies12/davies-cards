'use client';

import BaseInput from '@/components/base-input';
import BaseTextarea from '@/components/base-textarea';
import { createPlayer, getActivePlayers, getGameForEdit, getLocations, logGame, updateGame, type PlayerDTO } from '@/sections/game-log/gameLogActions';
import { Check, Info, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface ParsedPlayerScore {
  name: string;
  score: number;
  matchedPlayer: PlayerDTO | null;
}

interface LogGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameId?: number; // If provided, we're editing an existing game
}

interface CreatePlayerModalProps {
  isOpen: boolean;
  playerName: string;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

function CreatePlayerModal({ isOpen, playerName, onClose, onCreate }: CreatePlayerModalProps) {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleCreate() {
    setCreating(true);
    setError(null);
    try {
      await onCreate(playerName);
    } catch (err) {
      setError('Failed to create player');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-xs shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Create New Player</h3>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-neutral-600 mb-4">
            Player "{playerName}" not found. Would you like to create them?
          </p>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xs text-sm mb-4">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs border border-neutral-300 rounded-xs text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating}
              className="flex-1 px-4 py-2 bg-red-700 text-white rounded-xs hover:bg-red-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? 'Creating...' : 'Create Player'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LogGameModal({ isOpen, onClose, gameId }: LogGameModalProps) {
  const router = useRouter();
  const [players, setPlayers] = useState<PlayerDTO[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [message, setMessage] = useState('');
  const [scoresText, setScoresText] = useState('');
  const [parsedScores, setParsedScores] = useState<ParsedPlayerScore[]>([]);
  const [createPlayerModal, setCreatePlayerModal] = useState<{ isOpen: boolean; playerName: string }>({ isOpen: false, playerName: '' });
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [playersLoaded, setPlayersLoaded] = useState(false);
  const [loadingGameData, setLoadingGameData] = useState(false);
  const [originalGameData, setOriginalGameData] = useState<{
    date: string;
    location: string;
    message: string;
    playerScores: Array<{ playerId: number; score: number }>;
  } | null>(null);

  const locationRef = useRef<HTMLDivElement>(null);
  const playerListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (gameId) {
        // Load players first, then game data (so scores can be parsed immediately)
        loadData().then((loadedPlayers) => {
          // Pass the loaded players to loadGameData to avoid closure issues
          if (loadedPlayers && loadedPlayers.length > 0) {
            loadGameData(loadedPlayers);
          } else {
            loadGameData();
          }
        });
      } else {
        loadData();
      }
    } else {
      // Reset form when closing
      setDate(new Date().toISOString().split('T')[0]);
      setLocation('');
      setLocationSearch('');
      setMessage('');
      setScoresText('');
      setParsedScores([]);
      setError(null);
      setShowPlayerList(false);
      // Don't reset playersLoaded - keep the cache for next time modal opens
    }
  }, [isOpen, gameId]);

  async function loadGameData(playersList?: PlayerDTO[]) {
    if (!gameId) return;

    setLoadingGameData(true);
    try {
      const gameData = await getGameForEdit(gameId);
      if (gameData) {
        setDate(gameData.date);
        setLocation(gameData.location);
        setLocationSearch(gameData.location);
        setMessage(gameData.message || '');

        // Store original data for comparison
        setOriginalGameData({
          date: gameData.date,
          location: gameData.location,
          message: gameData.message || '',
          playerScores: gameData.playerScores.map(ps => ({
            playerId: ps.playerId,
            score: ps.score
          }))
        });

        // Format player scores for the textarea
        const scoresTextValue = gameData.playerScores
          .map(ps => `${ps.playerName} ${ps.score}`)
          .join(' ');
        setScoresText(scoresTextValue);

        // Parse scores - use provided players list or current players state
        const playersToUse = playersList || players;
        if (playersToUse.length > 0) {
          handleScoresTextChange(scoresTextValue, playersToUse);
        } else {
          // Fallback: if players aren't loaded yet, wait a bit and try again
          setTimeout(() => {
            const currentPlayers = players.length > 0 ? players : playersList;
            if (currentPlayers && currentPlayers.length > 0) {
              handleScoresTextChange(scoresTextValue, currentPlayers);
            }
          }, 200);
        }
      }
    } catch (err) {
      setError('Failed to load game data');
    } finally {
      setLoadingGameData(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (playerListRef.current && !playerListRef.current.contains(event.target as Node)) {
        setShowPlayerList(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function loadData(reloadPlayers: boolean = false): Promise<PlayerDTO[] | null> {
    setLoading(true);
    try {
      // Only reload players if explicitly requested (e.g., after creating a new player)
      // or if they haven't been loaded yet
      if (reloadPlayers || !playersLoaded) {
        const [activePlayers, gameLocations] = await Promise.all([
          getActivePlayers(),
          getLocations()
        ]);
        setPlayers(activePlayers);
        setLocations(gameLocations);
        setPlayersLoaded(true);
        return activePlayers;
      } else {
        // Just reload locations, keep cached players
        const gameLocations = await getLocations();
        setLocations(gameLocations);
        return players.length > 0 ? players : null;
      }
    } catch (err) {
      setError('Failed to load data');
      return null;
    } finally {
      setLoading(false);
    }
  }

  function parseScoresText(text: string, playersList: PlayerDTO[] = players): ParsedPlayerScore[] {
    if (!text.trim()) {
      return [];
    }

    // Pattern: match name followed by number
    // Handles formats like "Jake 123 Claire 144" or "Jake: 123, Claire: 144"
    const pattern = /([A-Za-z][A-Za-z\s]+?)\s*:?\s*(\d+)/g;
    const matches: ParsedPlayerScore[] = [];
    let match;

    while ((match = pattern.exec(text)) !== null) {
      const name = match[1].trim();
      const score = parseInt(match[2], 10);

      if (name && !isNaN(score)) {
        // Try to match player (case-insensitive, partial match)
        const matchedPlayer = playersList.find(
          p => p.name.toLowerCase() === name.toLowerCase() ||
            p.name.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(p.name.toLowerCase())
        ) || null;

        matches.push({
          name,
          score,
          matchedPlayer
        });
      }
    }

    return matches;
  }

  function handleScoresTextChange(text: string, playersList?: PlayerDTO[]) {
    setScoresText(text);
    const parsed = parseScoresText(text, playersList);
    setParsedScores(parsed);
  }

  function handleLocationSelect(selectedLocation: string) {
    setLocation(selectedLocation);
    setLocationSearch(selectedLocation);
    setShowLocationDropdown(false);
  }

  const locationMatches = locationSearch
    ? locations.filter(loc => loc.toLowerCase().includes(locationSearch.toLowerCase()))
    : locations;

  const exactMatch = locationSearch && locations.some(loc => loc.toLowerCase() === locationSearch.toLowerCase());
  const showCreateNew = locationSearch && !exactMatch && locationSearch.trim().length > 0;

  const allPlayersMatched = parsedScores.length > 0 && parsedScores.every(p => p.matchedPlayer);

  // Check if anything has changed when editing
  const hasChanges = gameId ? (() => {
    // If original data isn't loaded yet, return false (button will be disabled by loadingGameData anyway)
    if (!originalGameData) return false;

    // Check if date changed (normalize date format)
    const normalizedDate = date ? date.trim() : '';
    const normalizedOriginalDate = originalGameData.date ? originalGameData.date.trim() : '';
    if (normalizedDate !== normalizedOriginalDate) {
      return true;
    }

    // Check if location changed (case-insensitive comparison)
    const normalizedLocation = location ? location.trim() : '';
    const normalizedOriginalLocation = originalGameData.location ? originalGameData.location.trim() : '';
    if (normalizedLocation.toLowerCase() !== normalizedOriginalLocation.toLowerCase()) {
      return true;
    }

    // Check if message changed (normalize empty strings)
    const currentMessage = (message || '').trim();
    const originalMessage = (originalGameData.message || '').trim();
    if (currentMessage !== originalMessage) {
      return true;
    }

    // Check if player scores changed
    // Only check if we have parsed scores with matched players
    if (parsedScores.length > 0 && allPlayersMatched) {
      const currentPlayerScores = parsedScores
        .filter(p => p.matchedPlayer)
        .map(p => ({
          playerId: p.matchedPlayer!.id,
          score: p.score
        }))
        .sort((a, b) => {
          // Sort by playerId first, then by score
          if (a.playerId !== b.playerId) return a.playerId - b.playerId;
          return a.score - b.score;
        });

      const originalPlayerScores = [...originalGameData.playerScores]
        .sort((a, b) => {
          if (a.playerId !== b.playerId) return a.playerId - b.playerId;
          return a.score - b.score;
        });

      if (currentPlayerScores.length !== originalPlayerScores.length) {
        return true;
      }

      for (let i = 0; i < currentPlayerScores.length; i++) {
        if (currentPlayerScores[i].playerId !== originalPlayerScores[i].playerId ||
          currentPlayerScores[i].score !== originalPlayerScores[i].score) {
          return true;
        }
      }
    } else if (originalGameData.playerScores.length > 0) {
      // If we have original scores but current parsed scores aren't ready/matched yet
      // Consider it unchanged (will be false, blocking submission until scores are parsed)
      return false;
    }

    return false;
  })() : true;

  const canSubmit = date && location && parsedScores.length > 1 && allPlayersMatched && !loading && hasChanges;

  async function handleCreatePlayer(playerName: string) {
    const result = await createPlayer(playerName);
    if (result.success && result.player) {
      // Reload players (force reload) and re-parse scores
      await loadData(true);
      handleScoresTextChange(scoresText);
      setCreatePlayerModal({ isOpen: false, playerName: '' });
    } else {
      throw new Error(result.error || 'Failed to create player');
    }
  }

  async function handleQuickCreatePlayer(playerName: string) {
    const result = await createPlayer(playerName);
    if (result.success && result.player) {
      // Reload players (force reload) and re-parse scores with updated players list
      const [activePlayers, gameLocations] = await Promise.all([
        getActivePlayers(),
        getLocations()
      ]);
      setPlayers(activePlayers);
      setLocations(gameLocations);
      setPlayersLoaded(true);
      // Re-parse scores with the updated players list
      handleScoresTextChange(scoresText, activePlayers);
    } else {
      setError(result.error || 'Failed to create player');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!date || !location) {
      setError('Date and location are required');
      return;
    }

    if (parsedScores.length === 0) {
      setError('Please enter at least one player score');
      return;
    }

    // Check if all players are matched
    const unmatchedPlayers = parsedScores.filter(p => !p.matchedPlayer);
    if (unmatchedPlayers.length > 0) {
      // Show create player modal for first unmatched player
      setCreatePlayerModal({ isOpen: true, playerName: unmatchedPlayers[0].name });
      return;
    }

    setSubmitting(true);
    try {
      const playerScoresData = parsedScores.map(p => ({
        playerId: p.matchedPlayer!.id,
        score: p.score
      }));

      let result;
      if (gameId) {
        // Update existing game
        result = await updateGame({
          gameId,
          date,
          location,
          message: message || undefined,
          playerScores: playerScoresData
        });
      } else {
        // Create new game
        result = await logGame({
          date,
          location,
          message: message || undefined,
          playerScores: playerScoresData
        });
      }

      if (result.success) {
        // Reset form
        setDate(new Date().toISOString().split('T')[0]);
        setLocation('');
        setLocationSearch('');
        setMessage('');
        setScoresText('');
        setParsedScores([]);
        onClose();
        router.refresh();
        // Dispatch custom event to notify other components to refresh
        window.dispatchEvent(new CustomEvent('gameLogged'));
      } else {
        setError(result.error || (gameId ? 'Failed to update game' : 'Failed to log game'));
      }
    } catch (err) {
      setError(gameId ? 'Failed to update game' : 'Failed to log game');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{gameId ? 'Edit Game' : 'Log Game'}</h2>
                {(loadingGameData || submitting) && (
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <div className="w-4 h-4 border-2 border-neutral-300 border-t-red-700 rounded-full animate-spin"></div>
                    <span>{loadingGameData ? 'Loading...' : submitting ? (gameId ? 'Updating...' : 'Logging...') : ''}</span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || loadingGameData}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Date</label>
                <BaseInput
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-1">
                  Location
                </label>
                <div ref={locationRef} className="relative">
                  <BaseInput
                    type="text"
                    id="location"
                    value={locationSearch}
                    onChange={(e) => {
                      setLocationSearch(e.target.value);
                      setLocation(e.target.value);
                      setShowLocationDropdown(true);
                    }}
                    onFocus={() => setShowLocationDropdown(true)}
                    required
                    placeholder="e.g., Yorkville, IL"
                  />
                  {showLocationDropdown && (locationMatches.length > 0 || showCreateNew) && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-md shadow-md max-h-60 overflow-y-auto">
                      {locationMatches.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => handleLocationSelect(loc)}
                          className="w-full text-left px-2 py-1.5 hover:bg-neutral-100 text-sm"
                        >
                          {loc}
                        </button>
                      ))}
                      {showCreateNew && (
                        <button
                          type="button"
                          onClick={() => handleLocationSelect(locationSearch)}
                          className="w-full text-left rounded-md px-3 py-2 hover:bg-neutral-100 text-sm text-red-700 font-medium border-t border-neutral-200"
                        >
                          + Create "{locationSearch}"
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                  Message
                </label>
                <BaseTextarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="e.g., Game description and commentary"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <label htmlFor="scores" className="block text-sm font-medium text-neutral-700">
                    Player Scores
                  </label>
                  <div className="relative" ref={playerListRef}>
                    <button
                      type="button"
                      onClick={() => setShowPlayerList(!showPlayerList)}
                      className="text-neutral-500 hover:text-neutral-700 transition-colors flex items-center gap-1"
                      title="View player names"
                    >
                      <Info size={16} />
                      <span className="text-xs">(view player names)</span>
                    </button>
                    {showPlayerList && (
                      <>
                        <div
                          className="fixed inset-0 z-[60]!important bg-black/20"
                          onClick={() => setShowPlayerList(false)}
                        />
                        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-70 bg-white border border-neutral-200 rounded-md shadow-lg w-[90vw] max-w-sm max-h-[60vh] overflow-y-auto">
                          <div className="p-3 border-b border-neutral-200 sticky top-0 bg-white">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-neutral-700">Active Players</h4>
                              <button
                                type="button"
                                onClick={() => setShowPlayerList(false)}
                                className="text-neutral-500 hover:text-neutral-700"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="p-2">
                            {players.length === 0 ? (
                              <p className="text-xs text-neutral-500 py-2">No active players</p>
                            ) : (
                              <div className="space-y-1">
                                {players.map((player) => (
                                  <div
                                    key={player.id}
                                    className="text-sm text-neutral-700 px-2 py-1.5 rounded-md hover:bg-neutral-50"
                                  >
                                    {player.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <BaseTextarea
                  id="scores"
                  value={scoresText}
                  onChange={(e) => handleScoresTextChange(e.target.value)}
                  required
                  rows={3}
                  placeholder="Jake 133 Claire 144 Sophia 140"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Enter player names and scores separated by spaces (e.g., "Jake 123 Claire 144")
                </p>
              </div>

              {parsedScores.length > 0 && (
                <div className="rounded-md p-4 bg-neutral-100">
                  <h3 className="text-sm font-medium text-neutral-800 mb-2">Parsed Scores</h3>
                  <div className="space-y-2">
                    {parsedScores.map((parsed, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className={parsed.matchedPlayer ? 'text-neutral-700' : 'text-red-600'}>
                          {parsed.name} {parsed.score}
                        </span>
                        {parsed.matchedPlayer ? (
                          <span className="text-green-700 text-xs flex items-center gap-1">
                            <Check size={14} />
                            {parsed.matchedPlayer.name}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleQuickCreatePlayer(parsed.name)}
                            className="text-xs px-2 py-1 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors flex items-center gap-1"
                          >
                            <Plus size={14} />
                            Add Player
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-7 py-1.5 rounded-md bg-neutral-200 text-neutral-700 hover:bg-neutral-300 active:bg-neutral-400 active:text-neutral-800 transition-colors cursor-pointer ease-linear duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting || loadingGameData}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || submitting || loadingGameData}
                  className="px-7 py-1.5 bg-red-700 text-white rounded-md hover:bg-red-800 active:bg-red-900 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors cursor-pointer ease-linear duration-100 flex items-center gap-2"
                >
                  {submitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {submitting ? (gameId ? 'Updating...' : 'Logging...') : (gameId ? 'Update Game' : 'Log Game')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <CreatePlayerModal
        isOpen={createPlayerModal.isOpen}
        playerName={createPlayerModal.playerName}
        onClose={() => setCreatePlayerModal({ isOpen: false, playerName: '' })}
        onCreate={handleCreatePlayer}
      />
    </>
  );
}
