'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userAssets', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4, // Automatically generate UUID
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users', // Foreign key reference to Users table
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      assetType: {
        type: Sequelize.STRING, // This will store types like 'exchange', 'trade', etc.
        allowNull: false,
      },
      assetName: {
        type: Sequelize.STRING, // This will store the asset name (e.g., 'BTC', 'ETH')
        allowNull: false,
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2), // Storing balance with up to 2 decimal points
        defaultValue: 0.0,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('userAssets'); // This will drop the 'userAssets' table
  },
};
