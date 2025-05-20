export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'referralcode', {
      type: Sequelize.STRING(8),
      allowNull: false, // Ensures the referral code cannot be null
      unique: true, // Keep referral code unique
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'referralcode', {
      type: Sequelize.STRING(8),
      allowNull: true, // Revert the referral code column back to allowing null
      unique: true,
    });
  }
};
