'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update the `withdrawalPassword` in the `User` table from the `WithdrawalPassword` table
    const users = await queryInterface.sequelize.query(
      'SELECT id, userId FROM "Users";', 
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    for (let user of users) {
      const withdrawalPassword = await queryInterface.sequelize.query(
        `SELECT withdrawalPassword FROM "WithdrawalPasswords" WHERE "userId" = '${user.userId}' LIMIT 1;`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      if (withdrawalPassword.length > 0) {
        await queryInterface.bulkUpdate(
          'Users', 
          { withdrawalPassword: withdrawalPassword[0].withdrawalPassword },
          { userId: user.userId }
        );
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the `withdrawalPassword` in the `User` table to null or its previous state
    const users = await queryInterface.sequelize.query(
      'SELECT userId FROM "Users";', 
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    for (let user of users) {
      await queryInterface.bulkUpdate(
        'Users', 
        { withdrawalPassword: null }, // Reverting the withdrawalPassword to null
        { userId: user.userId }
      );
    }
  }
};
