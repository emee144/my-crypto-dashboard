export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('withdrawalhistories', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      currency: Sequelize.STRING,
      amountAfterFee: Sequelize.DECIMAL(20,8),
      chainName: Sequelize.STRING,
      withdrawalAddress: Sequelize.STRING,
      status: Sequelize.STRING,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('withdrawalhistories');
  },
};
