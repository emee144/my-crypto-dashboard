
export default {
  up: async (queryInterface, Sequelize) => {
  await queryInterface.createTable('orders', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    asset: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    direction: {
      type: Sequelize.ENUM('CALL', 'PUT'),
      allowNull: false,
    },
    entryPrice: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    expiryTime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    result: {
      type: Sequelize.ENUM('PENDING', 'WIN', 'LOSE'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    payout: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    amount: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },  
  });
},

 down: async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('orders');
},
};
