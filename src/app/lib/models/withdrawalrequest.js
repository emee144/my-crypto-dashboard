import { Model, DataTypes } from 'sequelize';

const defineWithdrawalRequestModel = (sequelize) => {
  class WithdrawalRequest extends Model {
    static associate(models) {
      WithdrawalRequest.belongsTo(models.User, {  // Capitalize 'User' here
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  WithdrawalRequest.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user', // matches the table name, which should be lowercase 'user'
        key: 'id',
      },
    },
    network: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    withdrawalAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amountRequested: {
      type: DataTypes.DECIMAL(20, 4),
      allowNull: false,
    },
    handlingFee: {
      type: DataTypes.DECIMAL(20, 4),
      allowNull: false,
    },
    amountAfterFee: {
      type: DataTypes.DECIMAL(20, 4),
      allowNull: false,
    },
    withdrawalPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'WithdrawalRequest',
    tableName: 'withdrawalrequests', // actual DB table name
    timestamps: false, // or true if you have updatedAt too
  });

  return WithdrawalRequest;
};
export default defineWithdrawalRequestModel;