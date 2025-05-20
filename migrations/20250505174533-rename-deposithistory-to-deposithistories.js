'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('DepositHistory', 'DepositHistories');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('deposithistories', 'deposithistory');
  }
};
