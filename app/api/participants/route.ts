import { db } from "@/db";
import { authenticateRequest } from '@/utils/authUtil';
import type { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  const session = await authenticateRequest(request);
  if (!session) {
    console.log('Unauthorized access attempt');
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      console.log('Missing name');
      return new Response('Missing name', { status: 400 });
    }

    const participant = await db.participant.create({
      data: {
        name,
      },
    });

    console.log('Participant created:', participant);
    return new Response(JSON.stringify(participant), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.log('Error creating participant:', e);
    return new Response('Error creating participant', { status: 500 });
  }
}

export const DELETE = async (request: NextRequest) => {
  const session = await authenticateRequest(request);
  if (!session) {
    console.log('Unauthorized access attempt');
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      console.log('Missing id');
      return new Response('Missing id', { status: 400 });
    }

    const participant = await db.participant.delete({
      where: {
        id: parseInt(id),
      },
    });

    console.log('Participant deleted:', participant);
    return new Response(JSON.stringify(participant), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.log('Error deleting participant:', e);
    return new Response('Error deleting participant', { status: 500 });
  }
}