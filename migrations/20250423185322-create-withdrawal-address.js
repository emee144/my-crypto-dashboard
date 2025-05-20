export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WithdrawalAddresses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      network: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // optional
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // optional
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WithdrawalAddresses');
  },
};