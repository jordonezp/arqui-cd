module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'email', { type: Sequelize.STRING });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'email');
  },
};
