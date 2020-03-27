import {sequelize} from "../sequelize";
import {ApiServer} from "../api-server";
import * as request from "request";
import { Server, HttpMethod } from "typescript-rest";

const apiServer = new ApiServer();
const userRequest: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>
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

    describe('POST /new', () => {
        it('should respond success message', done => {
            userRequest.post({
                body: `{'email': 'test@gmail.com', 'nickname': 'testUser', 'password': 'hereistest'}`,
                url: '/new'
            }, (error, response, body) => {
                expect(response.statusCode).toBe(200);
                expect(response.statusMessage).toBe('Sign up is successful');
                done();
            })
        });

        it('should respond conflict with existing user', done => {
            userRequest.post({
                body: `{'email': 'test@gmail.com', 'nickname': 'testUser', 'password': 'hereistest'}`,
                url: '/new'
            }, (error, response, body) => {
                expect(response.statusCode).toBe(409);
                expect(response.statusMessage).toBe('User already exists');
                done();
            })

        });
    });

    describe('POST /user', () => {

        let accessToken:string;

        it('should respond success message', done => {
            userRequest.post({
                body: `{'email': 'test@gmail.com', 'password': 'hereistest'}`,
                url: '/new'
            }, (error, response, body) => {
                expect(response.statusCode).toBe(200);
                expect(typeof body).toBe('string');
                accessToken = body;
                done();
            })
        });

        it ('should repond INVALID PASSWORD with invalid password information', done => {
            userRequest.post({
                body: `{'email': 'test@gmail.com', 'password': 'wrongpw'}`,
                url: '/new'
            }, (error, response, body) => {
                expect(response.statusCode).toBe(401);
                expect(response.statusMessage).toBe('Incorrect Password');
                done();
            })
        })

        it ('should repond INVALID PASSWORD with invalid password information', done => {
            userRequest.post({
                body: `{'email': 'wrong@gmail.com', 'password': 'hereistest'}`,
                url: '/new'
            }, (error, response, body) => {
                expect(response.statusCode).toBe(401);
                expect(response.statusMessage).toBe('Incorrect Password');
                done();
            })
        })
    })





})