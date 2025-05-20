export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('balances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      assetId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Assets', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      exchange: {  // Renamed to match deposit/asset naming
        type: Sequelize.DECIMAL(20, 8),
        allowNull: true,
        defaultValue: 0,
      },
      trade: {  // Renamed to match deposit/asset naming
        type: Sequelize.DECIMAL(20, 8),
        allowNull: true,
        defaultValue: 0,
      },
      perpetual: {  // Renamed to match deposit/asset naming
        type: Sequelize.DECIMAL(20, 8),
        allowNull: true,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('balances');
  },
};
