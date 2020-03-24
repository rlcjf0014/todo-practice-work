import { Sequelize } from "sequelize-typescript";
require("dotenv").config();


export const sequelize = new Sequelize({
  dialect: 'mariadb',
  database: 'todo',
  storage: ':memory:',
  username: "root",
  password:
  models: [__dirname + '../models']
});
