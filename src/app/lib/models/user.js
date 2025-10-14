// src/app/lib/models/user.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '@/app/lib/sequelize';

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
  User.hasMany(models.WithdrawalAddress, {
    foreignKey: 'userId',
    as: 'withdrawaladdresses',
  });

  User.hasMany(models.WithdrawalHistory, {
    foreignKey: 'userId',
    as: 'withdrawalhistories', // 👈 this is what's missing
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
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    referralcode: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true,
    },
    referral: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    ethAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tronAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isAdmin: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: false,
}
  }, {
    sequelize,
    modelName: 'User', // Capitalize the modelName here
    tableName: 'users',  // Keep the table name in lowercase and plural
    timestamps: true,
    freezeTableName: true,
  });

  return User;
};
