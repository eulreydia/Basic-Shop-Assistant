import Sequelize from "sequelize";
import loadStockModel from "./Stock.js";
import getEnvironmentConfig from '../config/config.js'

const sequelizeSession = new Sequelize(getEnvironmentConfig().database, getEnvironmentConfig().username, getEnvironmentConfig().password, getEnvironmentConfig())

const Stock = loadStockModel(sequelizeSession, Sequelize.DataTypes)

const db = { Stock }

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
});

sequelizeSession.sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch(err => console.error("Sync error: ", err));

export { Stock, sequelizeSession }