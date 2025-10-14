import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class TransferHistory extends Model {
    static associate(models) {
      TransferHistory.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  TransferHistory.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    assetType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    from: {
      type: DataTypes.ENUM('exchange', 'trade', 'perpetual'),
      allowNull: false,
    },
    to: {
      type: DataTypes.ENUM('exchange', 'trade', 'perpetual'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(18, 8), // Better precision for crypto
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'TransferHistory',
    tableName: 'transferhistories',
    timestamps: true,
  });

  return TransferHistory;
};
