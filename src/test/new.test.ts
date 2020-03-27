import {sequelize} from "../sequelize";
import {ApiServer} from "../api-server";
import * as request from "request";
import { Server, HttpMethod } from "typescript-rest";

const apiServer = new ApiServer();
const newRequest: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>
                = request.defaults({baseUrl: `http://localhost:${apiServer.PORT}`});

describe('User Controller Tests', () => {

    beforeAll(async () => {
        await sequelize.sync({force: false});
        await apiServer.start();
    })

    afterAll(async () => {
        await sequelize.close()
        await apiServer.stop();
    })

    describe('The Rest Server', () => {
        it('should provide a catalog containing the exposed paths', () => {
            expect(Server.getPaths()).toContain([
                '/new',
                '/user',
                '/user/:userid',
            ]);
            expect(Server.getHttpMethods('/new')).toContain([HttpMethod.POST]);
            expect(Server.getHttpMethods('/user')).toContain([HttpMethod.GET, HttpMethod.DELETE, HttpMethod.POST]);
        });
    });

    



})