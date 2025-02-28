import Sequelize from 'sequelize'

const initSequelize = async () => {
  const { database, username, password, host, port } = _getDatabaseConnectionProperties()

  const sequelizeConnection = new Sequelize(database, username, password, {
    host: databaseHost,
    port: databasePort,
    dialect: 'mariadb',
    dialectOptions: {
      allowPublicKeyRetrieval: true
    }
    //logging: false
  })
  await sequelizeConnection.authenticate()
  return sequelizeConnection
}

const disconnectSequelize = async (connection) => {
  return connection.close()
}

const _getDatabaseConnectionProperties = () => {
  const host = process.env.DB_HOST
  const port = process.env.DB_PORT
  const username = process.env.DB_USER
  const password = process.env.DB_PASSWORD
  const database = process.env.DB_NAME
  return { database, username, password, host, port }
}

export { initSequelize, disconnectSequelize }
