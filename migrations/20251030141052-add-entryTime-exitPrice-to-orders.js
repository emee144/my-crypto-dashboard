'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'entryTime', {
      type: Sequelize.DATE,
      allowNull: false, // make it required
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('orders', 'exitPrice', {
      type: Sequelize.FLOAT,
      allowNull: true, // optional for open trades
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'entryTime');
    await queryInterface.removeColumn('orders', 'exitPrice');
  },
};
