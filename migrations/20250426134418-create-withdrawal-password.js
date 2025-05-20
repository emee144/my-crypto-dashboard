
export default { 
  up: async (queryInterface, Sequelize) => {
  await queryInterface.createTable('WithdrawalPasswords', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true, // one withdrawal password per user
    },
    withdrawalPassword: {
      type: Sequelize.STRING,
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
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });
},

 down: async  (queryInterface, Sequelize) => {
  await queryInterface.dropTable('WithdrawalPasswords');
},
};
