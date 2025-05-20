export default {  
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Assets', 'crypto', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'USDT', // Optional: set default to USDT if you're already using it
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Assets', 'crypto');
  },
};
