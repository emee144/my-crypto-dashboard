import { Model, DataTypes } from 'sequelize';

const defineWithdrawalAddressModel = (sequelize) => {
  class WithdrawalAddress extends Model {  // Capitalize 'WithdrawalAddress'
    static associate(models) {
      WithdrawalAddress.belongsTo(models.User, {  // Capitalize 'User'
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  WithdrawalAddress.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    network: {
      type: DataTypes.ENUM('erc20', 'trc20'),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'WithdrawalAddress',  // Capitalize model name
    tableName: 'withdrawaladdresses', // Actual table name in DB remains the same
    timestamps: true,
  });

  return WithdrawalAddress;
};
export default defineWithdrawalAddressModel;