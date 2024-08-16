import dotenv from 'dotenv';

dotenv.config();

const config = {
  development: {
    use_env_variable: 'DATABASE_URL',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    seederStorage: 'sequelize'
  },
  test: {
    use_env_variable: 'DATABASE_URL_TEST',
    username: process.env.DB_USER_TEST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST_TEST,
    dialect: 'postgres',
    seederStorage: 'sequelize'
  },
  production: {
    use_env_variable: 'DATABASE_URL_PROD',
    username: process.env.DB_PROD_USER,
    password: process.env.DB_PROD_PASSWORD,
    database: process.env.DB_PROD_NAME,
    host: process.env.DB_PROD_HOST,
    logging: false,
    dialect: 'postgres',
  }
};

module.exports = config;
