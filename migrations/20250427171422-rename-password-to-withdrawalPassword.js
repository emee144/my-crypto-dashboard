export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('WithdrawalRequests', 'password', 'withdrawalPassword');
    await queryInterface.changeColumn('WithdrawalRequests', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'pending',
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('WithdrawalRequests', 'withdrawalPassword', 'password');
    await queryInterface.changeColumn('WithdrawalRequests', 'status', {
      type: Sequelize.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending',
      allowNull: false,
    });
  },
};
