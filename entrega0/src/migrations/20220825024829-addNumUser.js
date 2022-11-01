module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'phoneNumber', { type: Sequelize.INTEGER });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'phoneNumber');
  },
};
