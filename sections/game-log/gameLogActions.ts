'use server';

import { sql, toCamel } from '@/data/db';
import { revalidatePath } from 'next/cache';
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

export interface PlayerDTO {
  id: number;
  name: string;
}

async function _getActivePlayers(): Promise<PlayerDTO[]> {
  const result = await sql`
    SELECT id, name FROM player WHERE is_active = TRUE ORDER BY name
  `;
  return result.map(toCamel) as PlayerDTO[];
}

export const getActivePlayers = cache(_getActivePlayers);

async function _getLocations(): Promise<string[]> {
  const result = await sql`
    SELECT DISTINCT location FROM game ORDER BY location
  `;
  return result.map(row => row.location as string);
}

export const getLocations = cache(_getLocations);

export async function createPlayer(name: string): Promise<{ success: boolean; player?: PlayerDTO; error?: string }> {
  try {
    const result = await sql`
      INSERT INTO player (name, is_active) 
      VALUES (${name}, TRUE) 
      RETURNING id, name
    `;

    const player = toCamel(result[0]) as PlayerDTO;
    return { success: true, player };
  } catch (error) {
    console.error('Error creating player:', error);
    return { success: false, error: 'Failed to create player' };
  }
}

export interface LogGameInput {
  date: string;
  location: string;
  message?: string;
  playerScores: Array<{ playerId: number; score: number }>;
}

export async function logGame(input: LogGameInput) {
  try {
    // Create the game first
    const gameResult = await sql`
      INSERT INTO game (date, location, message) 
      VALUES (${input.date}, ${input.location}, ${input.message || null}) 
      RETURNING id
    `;

    const gameId = gameResult[0].id;

    // Insert player scores
    for (const playerScore of input.playerScores) {
      await sql`
        INSERT INTO player_score (player_id, game_id, score) 
        VALUES (${playerScore.playerId}, ${gameId}, ${playerScore.score})
      `;
    }

    revalidatePath('/');
    return { success: true, gameId };
  } catch (error) {
    console.error('Error logging game:', error);
    return { success: false, error: 'Failed to log game' };
  }
}

