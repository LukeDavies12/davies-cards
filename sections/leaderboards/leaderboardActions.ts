'use server';
import { sql, toCamel } from '@/data/db';

export interface PlayerWinStatsDTO {
  playerId: number;
  playerName: string;
  gamesPlayed: number;
  wins: number;
  winPercentage: number;
  avgPointsFromWin: number;
}

export async function getWinStatsData(filters: {
  minGamesPlayed: number;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
}): Promise<PlayerWinStatsDTO[]> {
  const sortKey = filters.sortKey || 'win_percentage';
  const sortDirection = filters.sortDirection || 'desc';

  // Convert camelCase to snake_case
  const snakeCase = sortKey.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

  const query = `SELECT * FROM get_player_stats($1, $2, $3)`;
  const rows = await sql.query(query, [filters.minGamesPlayed, snakeCase, sortDirection]);
  return rows.map(toCamel) as PlayerWinStatsDTO[];
}