// src/models/Balance.js

import { Model, DataTypes } from 'sequelize';

const defineBalanceModel = (sequelize) => {
  class Balance extends Model {
    static associate(models) {
      // Define associations between Balance, User, and Asset models
      Balance.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      Balance.belongsTo(models.Asset, {
        foreignKey: 'assetId',
        as: 'asset',
      });
    }
  }

  Balance.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      assetId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      exchange: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: true,
        defaultValue: 0,
      },
      trade: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: true,
        defaultValue: 0,
      },
      perpetual: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: true,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Balance',
      tableName: 'balances',
      timestamps: true, // Enable createdAt and updatedAt timestamps
      underscored: true, // Optional: Use snake_case for column names
    }
  );

  return Balance;
};

export default defineBalanceModel;
