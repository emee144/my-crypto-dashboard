export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'withdrawalPassword', {
      type: Sequelize.STRING,    // You can change this type to a suitable one (e.g., TEXT or VARCHAR)
      allowNull: false,          // Ensures withdrawalPassword is required
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'withdrawalPassword');
  },
};
