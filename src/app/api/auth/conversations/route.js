import { Conversation } from '@/lib/sequelize';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { userId } = req.nextUrl.searchParams;
  const conversations = await Conversation.findAll({
    where: { userId },
    include: ['messages'],  // Include associated messages
  });

  return NextResponse.json(conversations);
}

// POST: Create a new conversation
export async function POST(req) {
  const { userId } = await req.json();
  const newConversation = await Conversation.create({ userId });

  return NextResponse.json(newConversation);
}
