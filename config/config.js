import dotenv from 'dotenv';
dotenv.config(); // Loads variables from .env automatically

export default {
  development: {
    username: 'avnadmin',
    password: process.env.DB_PASSWORD,
    database: 'defaultdb',
    host: 'mysql-2d758026-nextradex66.d.aivencloud.com',
    port: 24521,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  
  production: {
    username: 'avnadmin',
    password: process.env.DB_PASSWORD,
    database: 'defaultdb',
    host: 'mysql-2d758026-nextradex66.d.aivencloud.com',
    port: 24521,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
