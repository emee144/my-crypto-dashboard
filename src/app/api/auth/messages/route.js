import { getUserFromToken } from '@/lib/jwtUtils';
import { Message } from '@/lib/sequelize';
import { NextResponse } from 'next/server';

// ✅ GET: Fetch messages for a conversation
export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ message: 'Missing conversationId' }, { status: 400 });
    }

    const messages = await Message.findAll({
      where: { conversationId },
      order: [['createdAt', 'ASC']],
      include: ['sender'], // optional, based on model associations
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error('❌ GET /api/auth/messages failed:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// ✅ POST: Create a new user message
export async function POST(req) {
  try {
    const user = getUserFromToken();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, message } = await req.json();

    if (!conversationId || !message) {
      return NextResponse.json({ message: 'Missing conversationId or message' }, { status: 400 });
    }

    const newMessage = await Message.create({
      conversationId,
      senderId: user.userId,
      message,
      isAdmin: false, // ✅ always false for user
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (err) {
    console.error('❌ POST /api/auth/messages failed:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
