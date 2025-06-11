export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('Users', 'resetPasswordToken', {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn('Users', 'resetPasswordExpires', {
    type: Sequelize.BIGINT,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('Users', 'resetPasswordToken');
  await queryInterface.removeColumn('Users', 'resetPasswordExpires');
}