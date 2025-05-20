export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('assets', 'assetType', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('assets', 'assetName', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('assets', 'assetName');
    await queryInterface.removeColumn('assets', 'assetType');
  }
};
