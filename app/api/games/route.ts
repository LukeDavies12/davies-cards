import { db } from "@/db";
import { authenticateRequest } from '@/utils/authUtil';
import type { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const session = await authenticateRequest(request);
  if (!session) return new Response('Unauthorized', { status: 401 });

  try {
    const body = await request.json();
    const { date, participantNames, winnerName, winnerScore, secondPlaceName, secondPlaceScore, thirdPlaceName, thirdPlaceScore, gameTypeId } = body;

    // Find participant IDs based on names
    const participants = await db.participant.findMany({
      where: {
        name: { in: participantNames }
      }
    });

    if (participants.length !== participantNames.length) {
      return new Response('One or more participants not found', { status: 404 });
    }

    const winner = await db.participant.findFirst({
      where: { name: winnerName }
    });

    const secondPlace = await db.participant.findFirst({
      where: { name: secondPlaceName }
    });

    const thirdPlace = await db.participant.findFirst({
      where: { name: thirdPlaceName }
    });

    if (!winner || !secondPlace || !thirdPlace) {
      return new Response('Participant not found', { status: 404 });
    }

    // Create the game in the database
    const game = await db.game.create({
      data: {
        date: date,
        winnerId: winner.id,
        secondPlaceId: secondPlace.id,
        thirdPlaceId: thirdPlace.id,
        winnerScore,
        secondPlaceScore,
        thirdPlaceScore,
        gameTypeId,
        participants: {
          connect: participants.map(p => ({ id: p.id })),
        },
      },
    });

    return new Response(JSON.stringify(game), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};


export const PUT = async (request: NextRequest) => {
  const session = await authenticateRequest(request);
  if (!session) return new Response('Unauthorized', { status: 401 });

  try {
    // Parse the request body to get game update data
    const body = await request.json();
    const { gameId, date, winnerId, winnerScore, secondPlaceId, secondPlaceScore, thirdPlaceId, thirdPlaceScore, gameTypeId } = body;

    // Update the game in the database
    const updatedGame = await db.game.update({
      where: { id: gameId },
      data: {
        date: new Date(date),
        winnerId,
        winnerScore,
        secondPlaceId,
        secondPlaceScore,
        thirdPlaceId,
        thirdPlaceScore,
        gameTypeId,
        // Update participants if necessary. This can be complex depending on how you handle relations.
        // You might need to disconnect/connect participants depending on the update logic.
      },
    });

    // Send the updated game as a response
    return new Response(JSON.stringify(updatedGame), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Handle any errors
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const DELETE = async (request: NextRequest) => {
  const session = await authenticateRequest(request);
  if (!session) return new Response('Unauthorized', { status: 401 });

  try {
    // Parse the request URL to get the game ID
    // Assuming the game ID is passed as a URL parameter
    const url = new URL(request.url);
    const gameId = url.searchParams.get('id');

    if (!gameId) {
      return new Response('Game ID is required', { status: 400 });
    }

    // Convert gameId to a number if it's a string
    const numericGameId = parseInt(gameId, 10);
    if (isNaN(numericGameId)) {
      return new Response('Invalid Game ID', { status: 400 });
    }

    // Delete the game from the database
    await db.game.delete({
      where: { id: numericGameId },
    });

    // Send a success response
    return new Response('Game deleted successfully', { status: 200 });
  } catch (error) {
    // Handle any errors, including cases where the game doesn't exist
    return new Response('Internal Server Error', { status: 500 });
  }
};