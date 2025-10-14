import { initModels } from '@/lib/models'; // Initialize models from your models directory
import { sequelize } from '@/lib/sequelize'; // Your Sequelize instance
import { getUserFromToken } from '@/lib/jwtUtils'; // JWT helper

const { Conversation, Message } = initModels(sequelize); // ✅ Destructure initialized models

export async function GET(req) {
  try {
    const user = getUserFromToken(); // This should work as long as jwtUtils uses `cookies()` correctly

    if (!user || !user.isAdmin) {
      return new Response(JSON.stringify({ message: 'Access denied. Admin only.' }), {
        status: 403,
      });
    }

    const conversations = await Conversation.findAll({
      include: [
        {
          model: Message,
          as: 'messages',
          required: false,
        },
            {
      model: User,
      as: 'users',
      attributes: ['id', 'email'], // limit what you send
    },
      ],
      order: [['createdAt', 'DESC']], // ✅ This orders conversations by their own createdAt
    });

    return new Response(JSON.stringify(conversations), { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching admin conversations:', error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), {
      status: 500,
    });
  }
}
