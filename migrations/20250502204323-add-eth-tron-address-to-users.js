export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'ethAddress', {
      type: Sequelize.STRING,
      allowNull: true, // Set to true if it's optional for the user to have an address
    });
    await queryInterface.addColumn('users', 'tronAddress', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove ethAddress and tronAddress columns if the migration is rolled back
    await queryInterface.removeColumn('users', 'ethAddress');
    await queryInterface.removeColumn('users', 'tronAddress');
  }
};
