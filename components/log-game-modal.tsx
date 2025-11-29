'use client';

import { createPlayer, getActivePlayers, getLocations, logGame, type PlayerDTO } from '@/sections/game-log/gameLogActions';
import { Check, X } from 'lucide-react';
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

export default function LogGameModal({ isOpen, onClose }: LogGameModalProps) {
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

  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    } else {
      // Reset form when closing
      setDate(new Date().toISOString().split('T')[0]);
      setLocation('');
      setLocationSearch('');
      setMessage('');
      setScoresText('');
      setParsedScores([]);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [activePlayers, gameLocations] = await Promise.all([
        getActivePlayers(),
        getLocations()
      ]);
      setPlayers(activePlayers);
      setLocations(gameLocations);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function parseScoresText(text: string): ParsedPlayerScore[] {
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
        const matchedPlayer = players.find(
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

  function handleScoresTextChange(text: string) {
    setScoresText(text);
    const parsed = parseScoresText(text);
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
  const canSubmit = date && location && parsedScores.length > 0 && allPlayersMatched && !loading;

  async function handleCreatePlayer(playerName: string) {
    const result = await createPlayer(playerName);
    if (result.success && result.player) {
      // Reload players and re-parse scores
      await loadData();
      handleScoresTextChange(scoresText);
      setCreatePlayerModal({ isOpen: false, playerName: '' });
    } else {
      throw new Error(result.error || 'Failed to create player');
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
      const result = await logGame({
        date,
        location,
        message: message || undefined,
        playerScores: parsedScores.map(p => ({
          playerId: p.matchedPlayer!.id,
          score: p.score
        }))
      });

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
      } else {
        setError(result.error || 'Failed to log game');
      }
    } catch (err) {
      setError('Failed to log game');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
        <div className="bg-white rounded-xs shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Log Game</h2>
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-700 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-neutral-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-1">
                  Location *
                </label>
                <div ref={locationRef} className="relative">
                  <input
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
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {showLocationDropdown && (locationMatches.length > 0 || showCreateNew) && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-300 rounded-xs shadow-lg max-h-60 overflow-y-auto">
                      {locationMatches.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => handleLocationSelect(loc)}
                          className="w-full text-left px-3 py-2 hover:bg-neutral-100 text-sm"
                        >
                          {loc}
                        </button>
                      ))}
                      {showCreateNew && (
                        <button
                          type="button"
                          onClick={() => handleLocationSelect(locationSearch)}
                          className="w-full text-left px-3 py-2 hover:bg-neutral-100 text-sm text-red-700 font-medium border-t border-neutral-200"
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
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., Game description and commentary"
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <div>
                <label htmlFor="scores" className="block text-sm font-medium text-neutral-700 mb-1">
                  Player Scores *
                </label>
                <textarea
                  id="scores"
                  value={scoresText}
                  onChange={(e) => handleScoresTextChange(e.target.value)}
                  required
                  placeholder="Jake 133 Claire 144 Sophia 140"
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Enter player names and scores separated by spaces (e.g., "Jake 123 Claire 144")
                </p>
              </div>

              {parsedScores.length > 0 && (
                <div className="border border-neutral-200 rounded-xs p-4 bg-neutral-50">
                  <h3 className="text-sm font-medium text-neutral-700 mb-2">Parsed Scores:</h3>
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
                          <span className="text-red-700 text-xs flex items-center gap-1">
                            <X size={14} />
                            No match
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xs text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-neutral-300 rounded-xs text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="px-4 py-2 bg-red-700 text-white rounded-xs hover:bg-red-800 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {submitting ? 'Logging...' : 'Log Game'}
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
