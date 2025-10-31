import { Model, DataTypes, Sequelize } from 'sequelize';

const defineOrderModel = (sequelize) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  Order.init(
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
      asset: {
        type: DataTypes.STRING, // e.g., 'BTC/USDT'
        allowNull: false,
      },
      direction: {
        type: DataTypes.ENUM('CALL', 'PUT'),
        allowNull: false,
      },
      entryPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      entryTime: {
        type: Sequelize.DATE,
        allowNull: false, // make it required
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
      exitPrice: {
      type: Sequelize.FLOAT,
      allowNull: true, // optional for open trades
    },
      expiryTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      result: {
        type: DataTypes.ENUM('PENDING', 'WIN', 'LOSE'),
        defaultValue: 'PENDING',
        allowNull: false,
      },
      payout: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
      timestamps: true,
    }
  );

  console.log('✅ Order model initialized');

  return Order;
};
export default defineOrderModel;