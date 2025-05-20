import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class DepositHistory extends Model {
    static associate(models) {
      // Assuming DepositHistory belongs to User (adjust if necessary)
      DepositHistory.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  DepositHistory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(20, 6),  // 6 decimal places for the deposit amount
        allowNull: false,
      },
      chainName: {
        type: DataTypes.STRING,  // 'ERC20', 'TRC20', etc.
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,  // 'USDT', 'BTC', 'ETH', etc.
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),  // Updated ENUM values
        allowNull: false,
        defaultValue: 'pending', // Default value set to 'pending'
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,  // Automatically sets the current timestamp
      },
    },
    {
      sequelize,
      modelName: 'DepositHistory',
      tableName: 'deposithistories',
      timestamps: true,  // If you want to include timestamps for createdAt and updatedAt
    }
  );

  console.log('✅ DepositHistory model initialized');

  return DepositHistory;
};
