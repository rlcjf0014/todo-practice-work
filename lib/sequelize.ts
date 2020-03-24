import {Sequelize} from 'sequelize-typescript';

export const sequelize = new Sequelize({
  dialect: 'mariadb',
  database: 'movies',
  storage: ':memory:',
  username: "root",
  password: "rlcjf0014",
  models: [__dirname + '/models']
});
