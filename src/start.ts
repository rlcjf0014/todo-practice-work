'use strict';

import {sequelize} from "../config";
// import { ApiServer } from './api-server';
import * as express from "express";
import { Server } from "typescript-rest";


export async function start(): Promise<void> {
    const db = await sequelize.sync({force: true});
    let app: express.Application = express();
    Server.buildServices(app);
    // const apiServer = new ApiServer();
    // await apiServer.start();

    app.listen(3000, function() {
        console.log("서버 성공!")
    })
    
    if (db){
        console.log("✓ DB connection success.");
        console.log("  Press CTRL-C to stop\n");
    }
    else {
        console.log("✗ DB connection error. Please make sure DB is running.");
        // await apiServer.stop();
        await db.close();
        process.exit();
    };
};
