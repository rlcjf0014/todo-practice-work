import {testdb} from "../dbtest";
import {ApiServer} from "../api-server";
import * as request from "request";
// import request from "supertest";
import { Server, HttpMethod } from "typescript-rest";
import * as jwt from 'jsonwebtoken';
require('dotenv').config();

const apiServer = new ApiServer();
const tokenRequest: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>
                = request.defaults({baseUrl: `http://localhost:${apiServer.PORT}`});

let accessToken:string;

const initializeData = function ():void {
    tokenRequest.post({
        body: {email: 'test@gmail.com', nickname:'testUser', password: 'hereistest'},
        json: true,
        url: '/new'
    }, (error, response, body) => {
        if(error) throw error
        return;
    });
    tokenRequest.post({
        body: {email: 'test@gmail.com', password: 'hereistest'},
        json: true,
        url: '/user'
    }, (error, response, body) => {
        if(error) throw error
        accessToken = body;
        return;
    })
}

describe('Token Controller Tests', () => {

    beforeAll(async () => {
        await testdb.sync({force: true});
        await apiServer.start();
        return initializeData();
    })

    afterAll(async () => {
        await testdb.close()
        return apiServer.stop();
    })

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

    describe('POST /todo', () => {

        it ('should respond JWT token error with invalid access token', done => {
            tokenRequest.post({
                headers: {authentication: "randomtoken"},
                url: '/todo'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(500);
                expect(response.statusMessage).toBe('Internal Server Error');
                // expect(body).toBe("hi");
                //! 에러처리 전체적으로 세부화
                done();
            })
        });

        it('should respond success message', done => {
            tokenRequest.post({
                headers: {authentication: accessToken},
                body: {content: 'take out trash', date: '2020-03-30', complete: 'Y'},
                json: true,
                url: '/todo'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(200);
                expect(typeof body).toBe('object');
                expect (body).toMatchObject({
                    content: expect.any(String),
                    date: expect.any(String),
                    complete: expect.any(String)
                })
                done();
            })
        });

        it ('should respond type error with invalid input information', done => {
            tokenRequest.post({
                headers: {authentication: accessToken},
                body: {content: 1234, date: '2020-03-30', complete: 'Y'},
                json: true,
                url: '/todo'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(500);
                expect(response.statusMessage).toBe('Internal Server Error');
                done();
            })
        })
    });

    describe('PUT /todo', () => {

        it ('should respond JWT token error with invalid access token', done => {
            tokenRequest.put({
                headers: {authentication: "randomtoken"},
                url: '/todo'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(500);
                expect(response.statusMessage).toBe('Internal Server Error');
                // expect(body).toBe("hi");
                //! 에러처리 전체적으로 세부화
                done();
            })
        });

        it('should respond success message', done => {
            tokenRequest.put({
                headers: {authentication: accessToken},
                body: {id:1, complete: 'C'},
                json: true,
                url: '/todo'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(200);
                expect(typeof body).toBe('object');
                expect (body).toMatchObject({
                    content: expect.any(String),
                    date: expect.any(String),
                    complete: 'C'
                });
                done();
            })
        });

        it ('should respond type error with invalid input information', done => {
            tokenRequest.put({
                headers: {authentication: accessToken},
                body: {id:2, complete: 'C'},
                json: true,
                url: '/todo'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(500);
                expect(response.statusMessage).toBe('Internal Server Error');
                done();
            });
        })
    });

    describe('GET /todo/:date', () => {

        it ('should respond error with invalid access token', done => {
            tokenRequest.get({
                headers: {authentication: 'wrongtokendata'},
                url: '/todo/2020-03-30'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(500);
                expect(response.statusMessage).toBe('Internal Server Error');
                done();
            })
        });

        it ('should respond error with invalid date', done => {
            tokenRequest.get({
                headers: {authentication: accessToken},
                url: '/todo/2020-03-20'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(500);
                expect(response.statusMessage).toBe('Internal Server Error');
                done();
            })
        });

        it ('should respond success message', done => {
            tokenRequest.get({
                headers: {authentication: accessToken},
                url: '/todo/2020-03-30'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(200);
                expect(typeof body).toBe('object');
                expect (body).toMatchObject({
                    content: expect.any(String),
                    date: expect.any(String),
                    complete: expect.any(String)
                });
                done();
            })
        });
    });

    describe('DELETE /todo/:todoid', () => {

        it ('should respond error with invalid access token', done => {
            tokenRequest.delete({
                headers: {authentication: 'wrongtokendata'},
                url: '/todo/1'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(500);
                expect(response.statusMessage).toBe('Internal Server Error');
                done();
            })
        });

        it ('should respond error with invalid todo id', done => {
            tokenRequest.delete({
                headers: {authentication: accessToken},
                url: '/todo/2'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(500);
                expect(response.statusMessage).toBe('Internal Server Error');
                done();
            })
        });


        it ('should respond success message', done => {
            tokenRequest.delete({
                headers: {authentication: accessToken},
                url: '/todo/1'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(200);
                expect(body).toBe('Successfully deleted todo');
                done();
            })
        });
    });


    






    });





