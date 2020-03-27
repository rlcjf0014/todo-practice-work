import {testdb} from "../dbtest";
import {ApiServer} from "../api-server";
import * as request from "request";
import { Server, HttpMethod } from "typescript-rest";


const apiServer = new ApiServer();
const userRequest: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>
                = request.defaults({baseUrl: `http://localhost:${apiServer.PORT}`});


describe('User Controller Tests', () => {



    beforeAll(async () => {
        await testdb.sync({force: true});
        return apiServer.start();
    })

    afterAll(async () => {
        await testdb.close()
        return apiServer.stop();
    })

    // let accessToken:string;

    describe('The Rest Server', () => {
        it('should provide a catalog containing the exposed paths', () => {
            expect(Server.getPaths()).toEqual([
                "/user", "/user/:userid", "/new", "/todo", "/todo/:date", "/todo/:todoid"
            ]);
            expect(Server.getHttpMethods('/new')).toEqual([HttpMethod.POST]);
            expect(Server.getHttpMethods('/user')).toEqual([HttpMethod.POST]);
            expect(Server.getHttpMethods('/user/:userid')).toEqual([HttpMethod.DELETE, HttpMethod.GET])
        });
    });

    describe('POST /new', () => {
        it('should respond success message', done => {
            userRequest.post({
                body: {email: 'test@gmail.com', nickname: 'testUser', password: 'hereistest'},
                json: true,
                url: '/new'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(200);
                expect(body).toBe('Sign up is successful');
                done();
            })
        });

        it('should respond conflict with existing user', done => {
            userRequest.post({
                body: {email: 'test@gmail.com', nickname: 'testUser', password: 'hereistest'},
                json: true,
                url: '/new'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(409);
                expect(response.statusMessage).toBe('ConflictError: User already exists');
                done();
            })
        });
    });

    describe('POST /user', () => {

        it('should respond success message', done => {
            userRequest.post({
                body: {email: 'test@gmail.com', password: 'hereistest'},
                json: true,
                url: '/new'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(200);
                expect(typeof body).toBe('string');
                // accessToken = body;
                done();
            })
        });

        it ('should respond INCORRECT PASSWORD with invalid password information', done => {
            userRequest.post({
                body: {email: 'test@gmail.com', password: 'wrongpw'},
                json: true,
                url: '/new'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(401);
                expect(response.statusMessage).toBe('Incorrect Password');
                done();
            })
        })

        it ('should respond INVALID EMAIL with invalid email information', done => {
            userRequest.post({
                body: {email: 'wrong@gmail.com', password: 'hereistest'},
                json: true,
                url: '/new'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(401);
                expect(response.statusMessage).toBe('Invalid Email');
                done();
            })
        })
    });

    // describe('DELETE /user/:userid', () => {

    //     it ('should respond ')

    // })

})