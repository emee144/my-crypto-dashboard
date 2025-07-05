import { Message } from '@/lib/sequelize';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { conversationId } = req.nextUrl.searchParams;
  const messages = await Message.findAll({
    where: { conversationId },
    include: ['sender'],
  });

  return NextResponse.json(messages);
}

// POST: Send a new message
export async function POST(req) {
  const { conversationId, senderId, message, isAdmin } = await req.json();
  const newMessage = await Message.create({
    conversationId,
    senderId,
    message,
    isAdmin,
  });

  return NextResponse.json(newMessage);
}
