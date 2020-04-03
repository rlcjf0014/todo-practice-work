import { Sequelize } from "sequelize-typescript";

require("dotenv").config();

const sequelize = new Sequelize({
    dialect: "mysql",
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    models: [`${__dirname}/models`],
});

export default sequelize;
