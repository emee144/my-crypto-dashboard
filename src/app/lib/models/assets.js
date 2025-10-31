import { DataTypes, Sequelize } from 'sequelize';

const defineAssetsModel = (sequelize) => {
  class Assets extends Sequelize.Model {
    static associate(models) {
      Assets.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  Assets.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      exchange: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        allowNull: false,
      },
      perpetual: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        allowNull: false,
      },
      trade: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
        allowNull: false,
      },
      moneyInTrades: {
        type: DataTypes.DECIMAL(20, 8),
        defaultValue: 0.0,
        allowNull: false,
      },
      assetType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      assetName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Assets',
      tableName: 'assets',
      timestamps: true,
    }
  );

  return Assets;
};

export default defineAssetsModel;
