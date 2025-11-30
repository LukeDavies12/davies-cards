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

export interface GameForEditDTO {
  gameId: number;
  date: string;
  location: string;
  message: string | null;
  playerScores: Array<{ playerId: number; playerName: string; score: number }>;
}

export async function getGameForEdit(gameId: number): Promise<GameForEditDTO | null> {
  try {
    const gameResult = await sql`
      SELECT id, date, location, message 
      FROM game 
      WHERE id = ${gameId}
    `;

    if (!gameResult || gameResult.length === 0) {
      return null;
    }

    const game = gameResult[0];
    const scoresResult = await sql`
      SELECT ps.player_id, ps.score, p.name as player_name
      FROM player_score ps
      JOIN player p ON ps.player_id = p.id
      WHERE ps.game_id = ${gameId}
    `;

    const playerScores = scoresResult.map((row: any) => ({
      playerId: row.player_id,
      playerName: row.player_name,
      score: row.score
    }));

    return {
      gameId: game.id,
      date: game.date instanceof Date ? game.date.toISOString().split('T')[0] : game.date,
      location: game.location,
      message: game.message,
      playerScores
    };
  } catch (error) {
    console.error('Error getting game for edit:', error);
    return null;
  }
}

export interface UpdateGameInput {
  gameId: number;
  date: string;
  location: string;
  message?: string;
  playerScores: Array<{ playerId: number; score: number }>;
}

export async function updateGame(input: UpdateGameInput): Promise<{ success: boolean; error?: string }> {
  try {
    // Update the game
    await sql`
      UPDATE game 
      SET date = ${input.date}, location = ${input.location}, message = ${input.message || null}
      WHERE id = ${input.gameId}
    `;

    // Delete existing player scores
    await sql`
      DELETE FROM player_score WHERE game_id = ${input.gameId}
    `;

    // Insert new player scores
    for (const playerScore of input.playerScores) {
      await sql`
        INSERT INTO player_score (player_id, game_id, score) 
        VALUES (${playerScore.playerId}, ${input.gameId}, ${playerScore.score})
      `;
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating game:', error);
    return { success: false, error: 'Failed to update game' };
  }
}

export async function deleteGame(gameId: number): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete player scores first (due to foreign key constraint)
    await sql`
      DELETE FROM player_score WHERE game_id = ${gameId}
    `;

    // Delete the game
    await sql`
      DELETE FROM game WHERE id = ${gameId}
    `;

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting game:', error);
    return { success: false, error: 'Failed to delete game' };
  }
}

