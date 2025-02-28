import { Model } from "sequelize";

const loadModel = (sequelize, DataTypes) => {

    class Stock extends Model {
      
      //Metodos Adicionales

    }

    Stock.init({
  
      prenda: {
        type: DataTypes.ENUM('camiseta', 'pantalon', 'sudadera', 'falda'),
        allowNull: false
      },
      talla: {
        type: DataTypes.ENUM('XS', 'S', 'M', 'L', 'XL'),
        allowNull: false
      },
      color: {
        type: DataTypes.ENUM('negro', 'blanco', 'azul', 'rojo', 'amarillo', 'gris', 'beige'),
        allowNull: false
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
  
    }, {
      sequelize,
      modelName: 'Stock',
      tableName: 'Stock',
      freezeTableName: true
    });

    return Stock;
  }
  export default loadModel;