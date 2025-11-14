'use server';

import { sql, toCamel } from '@/data/db';

export interface TopScoreByPlayerCountDTO {
  playerCount: number;
  playerId: number;
  playerName: string;
  score: number;
  gameId: number;
  gameDate: string;
  gameLocation: string;
  rank: number;
}

export async function getTopScoresByPlayerCount(): Promise<TopScoreByPlayerCountDTO[]> {
  'use cache';

  const query = `SELECT * FROM get_top_scores_by_player_count()`;
  const rows = await sql.query(query);
  return rows.map((row) => {
    const camelRow = toCamel(row) as any;
    // Convert date to string if it's a Date object
    if (camelRow.gameDate instanceof Date) {
      camelRow.gameDate = camelRow.gameDate.toISOString().split('T')[0];
    }
    return camelRow as TopScoreByPlayerCountDTO;
  });
}

