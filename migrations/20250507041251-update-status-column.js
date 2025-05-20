export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('withdrawalhistories', 'status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending', // default value
    });
  },

  async down(queryInterface, Sequelize) {
    // In the down migration, remove the ENUM and revert it back to a STRING
    await queryInterface.changeColumn('withdrawalhistories', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending',
    });
  },
};
