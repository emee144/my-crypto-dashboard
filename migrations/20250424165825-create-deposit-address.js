
export default  {
up: async (queryInterface, Sequelize) => {
  await queryInterface.createTable('DepositAddresses', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('(UUID())') // For MySQL
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    network: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW')
    }
  });
},

down: async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('DepositAddresses');
},
};