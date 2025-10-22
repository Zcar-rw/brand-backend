import dotenv from 'dotenv';

dotenv.config();

const config = {
  development: {
    mongoUrl: process.env.MONGODB_URI,
    url: process.env.DATABASE_URL,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 6543,
    logging: true,
    dialect: 'postgres',
    seederStorage: 'sequelize',
    logging: (msg) => console.log(msg),
    benchmark: true,
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  test: {
    mongoUrl: process.env.MONGODB_URI_TEST,
    use_env_variable: 'DATABASE_URL_TEST',
    username: process.env.DB_USER_TEST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST_TEST,
    logging: true,
    dialect: 'postgres',
    seederStorage: 'sequelize',
  },
  production: {
    mongoUrl: process.env.MONGODB_URI_PROD,
    url: process.env.DATABASE_URL_PROD,
    username: process.env.DB_PROD_USER,
    password: process.env.DB_PROD_PASSWORD,
    database: process.env.DB_PROD_NAME,
    host: process.env.DB_PROD_HOST,
    logging: true,
    dialect: 'postgres',
    seederStorage: 'sequelize',
  },
};
module.exports = config;
