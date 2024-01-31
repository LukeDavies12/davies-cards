import { db } from "@/db";
import { authenticateRequest } from '@/utils/authUtil';
import { Participant } from "@prisma/client";
import type { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const session = await authenticateRequest(request);
  if (!session) {
    console.log('Unauthorized access attempt');
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, participantNames, winnerName, winnerScore, secondPlaceName, secondPlaceScore, thirdPlaceName, thirdPlaceScore, gameTypeId } = body;

    console.log('Received body:', body);

    const participantsFromFormString = participantNames.split(',').map((name: string) => name.trim());
    console.log('Participants from form:', participantsFromFormString);

    const participants = await db.participant.findMany({
      where: { name: { in: participantsFromFormString } }
    });

    console.log('Participants found in DB:', participants);

    if (participants.length !== participantsFromFormString.length) {
      console.log('Participant count mismatch');
      return new Response('One or more participants not found', { status: 404 });
    }

    const winner = await db.participant.findFirst({ where: { name: winnerName } });
    const secondPlace = await db.participant.findFirst({ where: { name: secondPlaceName } });
    const thirdPlace = await db.participant.findFirst({ where: { name: thirdPlaceName } });

    if (!winner || !secondPlace || !thirdPlace) {
      console.log('One or more winners not found');
      return new Response('Participant not found', { status: 404 });
    }

    const game = await db.game.create({
      data: {
        date: new Date(date),
        winnerId: winner.id,
        secondPlaceId: secondPlace.id,
        thirdPlaceId: thirdPlace.id,
        winnerScore: parseInt(winnerScore),
        secondPlaceScore: parseInt(secondPlaceScore),
        thirdPlaceScore: parseInt(thirdPlaceScore),
        gameTypeId: parseInt(gameTypeId),
        participants: {
          connect: participants.map((p: Participant) => ({ id: p.id })),
        },
      },
    });

    console.log('Game created:', game);
    return new Response(JSON.stringify(game), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in POST route:', error);
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