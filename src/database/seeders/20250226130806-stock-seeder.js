module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Stock", [
      { prenda: "camiseta", talla: "M", color: "negro", cantidad: 10, createdAt: new Date(), updatedAt: new Date() },
      { prenda: "pantalon", talla: "L", color: "azul", cantidad: 5, createdAt: new Date(), updatedAt: new Date() },
      { prenda: "sudadera", talla: "XL", color: "rojo", cantidad: 8, createdAt: new Date(), updatedAt: new Date() },
      { prenda: "falda", talla: "S", color: "blanco", cantidad: 15, createdAt: new Date(), updatedAt: new Date() },
      { prenda: "camiseta", talla: "S", color: "blanco", cantidad: 12, createdAt: new Date(), updatedAt: new Date() },
      { prenda: "pantalon", talla: "M", color: "gris", cantidad: 7, createdAt: new Date(), updatedAt: new Date() },
      { prenda: "sudadera", talla: "L", color: "amarillo", cantidad: 9, createdAt: new Date(), updatedAt: new Date() },
      { prenda: "falda", talla: "XS", color: "beige", cantidad: 6, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Stock", null, {});
  }
};
