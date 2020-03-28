import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as morgan from 'morgan';
import { Server} from 'typescript-rest';
import path = require('path');
require("dotenv").config();

export class ApiServer {
    public PORT: number = 3000;

    private readonly app: express.Application;
    private server: http.Server = null;

    constructor() {
        this.app = express();
        this.config();

        Server.loadServices(this.app, 'controller/*', __dirname);
        Server.swagger(this.app, { filePath: './dist/swagger.json' });
    }

    /**
     * Start the server
     */
    public async start() {
        return new Promise<any>((resolve, reject) => {
            this.server = this.app.listen(this.PORT, (err: any) => {
                if (err) {
                    return reject(err);
                }
                console.log(`Listening to http://127.0.0.1:${this.PORT}`);

                return resolve();
            });
        });

    }

    /**
     * Stop the server (if running).
     * @returns {Promise<boolean>}
     */
    public async stop(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (this.server) {
                this.server.close(() => {
                    return resolve(true);
                });
            } else {
                return resolve(true);
            }
        });
    }

    /**
     * Configure the express app.
     */
    private config(): void {
        // Native Express configuration
        this.app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
        this.app.use(cors());
        this.app.use(morgan('combined'));
        
        // this.configureAuthenticator();
    }
}