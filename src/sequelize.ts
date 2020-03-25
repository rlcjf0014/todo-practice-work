import {Sequelize} from 'sequelize-typescript';
require("dotenv").config()

export const sequelize = new Sequelize({
  dialect: 'mariadb',
  database: process.env.DB_NAME,
  storage: ':memory:',
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  models: [__dirname + '/models']
});