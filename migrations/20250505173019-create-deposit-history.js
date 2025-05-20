export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DepositHistory', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users', // Assuming there's a Users table
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      depositAmount: {
        type: Sequelize.DECIMAL(20, 6), // USDT has precision up to 6 decimal places
        allowNull: false,
      },
      chainName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['erc20', 'trc20']], // Add more chains if needed
        },
      },
      currency: {
        type: Sequelize.ENUM('USDT', 'BTC', 'ETH'),
        allowNull: false,
        defaultValue: 'USDT', // Default is USDT
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      depositDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DepositHistory');
  },
};
