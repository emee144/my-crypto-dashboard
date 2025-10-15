import { getUserFromToken } from '@/lib/jwtUtils';
import { Message } from '@/app/lib/models/message'; // ✅ direct import
// import { sequelize } from '@/lib/sequelize'; // only if you need transactions

export async function POST(req) {
  console.log('📩 Incoming POST /api/auth/admin/sendmessages');

  try {
    const user = getUserFromToken(req); // ✅ pass req to read cookies
    console.log('🔐 Decoded user:', user);

    if (!user || !user.isAdmin) {
      console.warn('🚫 Unauthorized access attempt by:', user);
      return new Response(
        JSON.stringify({ message: 'Access denied. Admin only.' }),
        { status: 403 }
      );
    }

    const body = await req.json();
    console.log('📥 Request body:', body);

    const { conversationId, message } = body;

    if (!conversationId || !message) {
      console.warn('⚠️ Missing conversationId or message');
      return new Response(
        JSON.stringify({ message: 'Missing conversationId or message' }),
        { status: 400 }
      );
    }

    const newMessage = await Message.create({
      conversationId,
      message,
      senderId: user.userId, // ✅ Using user.userId based on your structure
      isAdmin: true,
    });

    console.log('✅ Message created:', newMessage);

    return new Response(JSON.stringify(newMessage), { status: 201 });

  } catch (err) {
    console.error('❌ Failed to send admin message:', err);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export function GET() {
  return new Response(
    JSON.stringify({ message: 'Method Not Allowed' }),
    { status: 405 }
  );
}
