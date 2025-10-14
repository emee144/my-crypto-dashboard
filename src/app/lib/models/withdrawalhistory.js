import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class WithdrawalHistory extends Model {
    static associate(models) {
      WithdrawalHistory.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  WithdrawalHistory.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amountAfterFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    chainName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    withdrawalAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'rejected'), // Updated ENUM values
        allowNull: false,
        defaultValue: 'pending', // Default value set to 'pending'
      },
  }, {
    sequelize,
    modelName: 'WithdrawalHistory',
    tableName: 'withdrawalhistories',
    timestamps: true,
  });

  return WithdrawalHistory;
};
