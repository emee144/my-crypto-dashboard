export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'ethAddress', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('users', 'tronAddress', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'ethAddress', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'tronAddress', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
