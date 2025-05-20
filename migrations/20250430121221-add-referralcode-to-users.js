export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'referralcode', {
      type: Sequelize.STRING(8),
      allowNull: true,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'referralcode');
  },
};
