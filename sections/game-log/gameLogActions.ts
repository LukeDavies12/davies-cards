'use server';

import { sql, toCamel } from '@/data/db';
import { cache } from 'react';

export interface GameDetailsDTO {
  gameId: number;
  gameDate: string;
  gameLocation: string;
  gameMessage: string | null;
  gameImageUrl: string | null;
  scoreImageUrl: string | null;
  playerCount: number;
  winnerName: string | null;
  winnerScore: number | null;
}

export interface GamePlayerScoreDTO {
  playerId: number;
  playerName: string;
  score: number;
}

async function _getGamesWithDetails(page: number = 1, limit: number = 10): Promise<GameDetailsDTO[]> {
  const offset = (page - 1) * limit;
  const query = `SELECT * FROM get_games_with_details($1, $2)`;
  const rows = await sql.query(query, [offset, limit]);
  return rows.map((row) => {
    const camelRow = toCamel(row) as any;
    // Convert date to string if it's a Date object
    if (camelRow.gameDate instanceof Date) {
      camelRow.gameDate = camelRow.gameDate.toISOString().split('T')[0];
    }
    return camelRow as GameDetailsDTO;
  });
}

async function _getGamePlayerScores(gameId: number): Promise<GamePlayerScoreDTO[]> {
  const query = `SELECT * FROM get_game_player_scores($1)`;
  const rows = await sql.query(query, [gameId]);
  return rows.map(toCamel) as GamePlayerScoreDTO[];
}

export const getGamesWithDetails = cache(_getGamesWithDetails);
export const getGamePlayerScores = cache(_getGamePlayerScores);

