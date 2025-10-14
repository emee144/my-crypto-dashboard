// /lib/models/message.js
import { Model, DataTypes } from 'sequelize';

const defineMessageModel = (sequelize) => {
  class Message extends Model {
    static associate(models) {
      // A message belongs to one conversation
      Message.belongsTo(models.Conversation, { foreignKey: 'conversationId', as: 'conversation' });

      // A message belongs to one user (the sender)
      Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Auto increment for each new message
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false, // A message must belong to a conversation
        references: {
          model: 'conversations',
          key: 'id',
        },
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: true, // Null for admin messages
        references: {
          model: 'users',
          key: 'id',
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false, // The message content cannot be null
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default to false, meaning the message is from a user
      },
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'messages',
      timestamps: true, // Automatically adds `createdAt` and `updatedAt`
    }
  );

  console.log('✅ Message model initialized');

  return Message;
};

export default defineMessageModel;
