import { Model, DataTypes } from 'sequelize';

const defineConversationModel = (sequelize) => {
  class Conversation extends Model {
    static associate(models) {
      // Each Conversation belongs to one User
      Conversation.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

      // Each Conversation can have many Messages
      Conversation.hasMany(models.Message, { foreignKey: 'conversationId', as: 'messages' });
    }
  }

  Conversation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users', // Ensure the 'users' table exists
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Conversation',
      tableName: 'conversations',
      timestamps: true,  // Automatically adds createdAt and updatedAt
    }
  );

  console.log('✅ Conversation model initialized');

  return Conversation;
};
export default defineConversationModel;