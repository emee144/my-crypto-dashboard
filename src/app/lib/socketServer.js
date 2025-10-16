import { Server } from 'socket.io';
import { sequelize } from './sequelize';
import defineUserModel from '@/app/lib/models/user';
import defineConversationModel from '@/app/lib/models/conversation';
import defineMessageModel from '@/app/lib/models/message';

const User = defineUserModel(sequelize);
const Conversation = defineConversationModel(sequelize, User);
const Message = defineMessageModel(sequelize, User, Conversation);

let io;

export const initSocket = (server) => {
  if (io) return io; // prevent multiple instances
  io = new Server(server, {
    cors: { origin: '*' }, // update in production
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined room ${conversationId}`);
    });

    // User sends a message
    socket.on('send_message', async (msg) => {
      const { conversationId, message, senderId, isAdmin } = msg;

      // Save message to DB
      const newMessage = await Message.create({ conversationId, message, senderId, isAdmin });

      // Broadcast to room
      io.to(conversationId).emit('new_message', newMessage);
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id);
    });
  });

  return io;
};
