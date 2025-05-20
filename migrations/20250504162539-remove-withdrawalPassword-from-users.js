'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'withdrawalPassword');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'withdrawalPassword', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
