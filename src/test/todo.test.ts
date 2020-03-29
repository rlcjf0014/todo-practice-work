import {testdb} from "../dbtest";
import {ApiServer} from "../api-server";
import * as request from "request";
import * as jwt from 'jsonwebtoken';
import { Server, HttpMethod } from "typescript-rest";
require('dotenv').config();

const apiServer = new ApiServer();
const tokenRequest: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>
                = request.defaults({baseUrl: `http://localhost:${apiServer.PORT}`});



describe('Todo Controller Tests', () => {

    let accessToken:string; 

    beforeAll(async () => {
        await testdb.sync({force: true});
        await apiServer.start();
        await testdb.query("insert into Users values (default, 'test@gmail.com', 'hipassword', 'pingu', default, default, default, default)")
        accessToken = jwt.sign({
            id: 1,
            nickname:'testUser',
            email: 'test@gmail.com'
        }, process.env.JWT_SECRET_ACCESS, { expiresIn: '1d'});
        return;
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
                body: {date: '2020-03-30', complete: 'Y'},
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
                expect(typeof body).toBe('string');
                expect (body).toBe('Successfully updated todo')
                done();
            })
        });

        it ('should respond Not Found with invalid todo information', done => {
            tokenRequest.put({
                headers: {authentication: accessToken},
                body: {id:4, complete: 'C'},
                json: true,
                url: '/todo'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(404);
                expect(response.statusMessage).toBe('Not Found');
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
                expect(response.statusCode).toBe(200);
                expect(body).toBe('[]')
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
                expect(typeof JSON.parse(body)).toBe('object');
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
                url: '/todo/5'
            }, (error, response, body) => {
                if(error) throw error
                expect(response.statusCode).toBe(409);
                expect(response.statusMessage).toBe('Conflict');
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





