import { DataTypes, Sequelize } from 'sequelize';

export default (sequelize) => {
  class Assets extends Sequelize.Model {
    static associate(models) {
      // Define associations here if needed
      Assets.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user', // Alias for the association
      });
    }
  }

  Assets.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users', // Referencing the 'Users' table
          key: 'id', // Referencing the 'id' column in the Users table
        },
        onDelete: 'CASCADE', // If the user is deleted, delete the related assets
      },
      exchange: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0, // Default value for exchange
        allowNull: false,
      },
      perpetual: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0, // Default value for perpetual
        allowNull: false,
      },
      trade: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0, // Default value for trade
        allowNull: false,
      },
      
      assetType: {
        type: DataTypes.STRING, // Define assetType column here
        allowNull: false, // Set as required (or true if optional)
      },
      assetName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize, // Pass the sequelize instance to the model
      modelName: 'Assets', // Define the model name
      tableName: 'assets', // Define the table name
      timestamps: true, // Enable timestamps (createdAt, updatedAt)
    }
  );

  return Assets;
};
