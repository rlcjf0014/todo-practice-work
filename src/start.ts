'use strict';

const models = require("../config");
import { ApiServer } from './api-server';

export async function start(): Promise<void> {
    const apiServer = new ApiServer();
    await apiServer.start();
    const db = await models.sequelize.sync();
    if (db){
        console.log("✓ DB connection success.");
        console.log("  Press CTRL-C to stop\n");
    }
    else {
        console.log("✗ DB connection error. Please make sure DB is running.");
        await apiServer.stop();
        process.exit();
    };
};
