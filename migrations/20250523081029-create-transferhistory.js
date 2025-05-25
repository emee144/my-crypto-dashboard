export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transferhistories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      assetType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      from: {
        type: Sequelize.ENUM('exchange', 'trade', 'perpetual'),
        allowNull: false,
      },
      to: {
        type: Sequelize.ENUM('exchange', 'trade', 'perpetual'),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(18, 8),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },      
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transferhistories');
  },
};
