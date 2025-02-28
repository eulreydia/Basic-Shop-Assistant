module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Stock', {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      prenda: {
        type: Sequelize.ENUM('camiseta', 'pantalon', 'sudadera', 'falda'),
        allowNull: false,
      },
      talla: {
          type: Sequelize.ENUM('XS', 'S', 'M', 'L', 'XL'),
          allowNull: false,
      },
      color: {
          type: Sequelize.ENUM('negro', 'blanco', 'azul', 'rojo', 'amarillo', 'gris', 'beige'),
          allowNull: false,
      },
      cantidad: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
      },
      createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
      },
      updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
      }

    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Stock');
  }
};
