// src/app/lib/models/user.js
import { Model, DataTypes } from 'sequelize';

const defineUserModel = (sequelize) => {
  // ✅ Prevent re-definition
  if (sequelize.models.User) return sequelize.models.User;

  class User extends Model {
    static associate(models) {
      User.hasMany(models.WithdrawalAddress, {
        foreignKey: 'userId',
        as: 'withdrawaladdresses',
      });

      User.hasMany(models.WithdrawalHistory, {
        foreignKey: 'userId',
        as: 'withdrawalhistories',
      });

      User.hasMany(models.Assets, {
        foreignKey: 'userId',
        as: 'assets',
      });
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    referralcode: { type: DataTypes.STRING(8), allowNull: false, unique: true },
    referral: { type: DataTypes.STRING(8), allowNull: true },
    ethAddress: { type: DataTypes.STRING, allowNull: false, unique: true },
    tronAddress: { type: DataTypes.STRING, allowNull: false, unique: true },
    isAdmin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users', // ✅ lowercase
    timestamps: true,
    freezeTableName: true,
  });

  return User;
};

export default defineUserModel;
