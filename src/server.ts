/* eslint-disable no-console */
// import {createServer} from 'http';
// import {app} from './app';
import sequelize from "./sequelize";
import ApiServer from "./api-server";


const start = async ():Promise<void> => {
    const db = await sequelize.sync({ force: true });
    const apiServer = new ApiServer();
    if (db) {
        console.log("Database is now connected");
        await apiServer.start();
    } else {
        console.log("Database connection has failed");
        await sequelize.close();
        await apiServer.stop();
        process.exit(0);
    }
};

export default start;
