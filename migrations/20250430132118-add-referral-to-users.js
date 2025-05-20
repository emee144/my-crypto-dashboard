export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'referral', {
      type: Sequelize.STRING(8), // referral code length is 8 characters
      allowNull: true,  // Allow users to sign up without a referral code
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'referral');
  }
};
