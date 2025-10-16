import { getUserFromToken } from '@/lib/jwtUtils';
import defineConversationModel from '@/app/lib/models/conversation';
import defineMessageModel from '@/app/lib/models/message';
import defineUserModel from '@/app/lib/models/user';
import { sequelize } from '@/lib/sequelize';

const User = defineUserModel(sequelize);
const Conversation = defineConversationModel(sequelize, User);
const Message = defineMessageModel(sequelize, User, Conversation);

export async function GET(req) {
  try {
    const user = await getUserFromToken(req); // ✅ pass req

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
          separate: true,
          order: [['createdAt', 'ASC']],
        },
        {
          model: User,
          as: 'users',
          attributes: ['id', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return new Response(JSON.stringify(conversations), { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching admin conversations:', error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), {
      status: 500,
    });
  }
}
