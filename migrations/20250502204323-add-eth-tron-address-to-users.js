'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('assets', 'assetType', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'exchange', // optional: helps prevent issues on existing rows
    });

    await queryInterface.addColumn('assets', 'assetName', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'usdt', // optional: change to a real value you expect
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('assets', 'assetName');
    await queryInterface.removeColumn('assets', 'assetType');
  }
};
