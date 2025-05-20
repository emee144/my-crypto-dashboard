
export default {
   up: async (queryInterface, Sequelize) => {
  await queryInterface.createTable('WithdrawalRequests', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Your Users table name
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    network: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    withdrawalAddress: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    amountRequested: {
      type: Sequelize.DECIMAL(20, 4),
      allowNull: false,
    },
    handlingFee: {
      type: Sequelize.DECIMAL(20, 4),
      allowNull: false,
    },
    amountAfterFee: {
      type: Sequelize.DECIMAL(20, 4),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM('pending', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
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
  await queryInterface.dropTable('WithdrawalRequests');
},
};
