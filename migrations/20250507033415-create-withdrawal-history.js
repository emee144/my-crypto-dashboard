export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('withdrawalhistories', {
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
          model: 'users', // make sure this matches your actual table name (case-sensitive!)
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amountAfterFee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      chainName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      withdrawalAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('withdrawalhistories');
  },
};
