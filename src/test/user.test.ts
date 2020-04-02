import {testdb} from "../dbtest";
import {ApiServer} from "./testServer";
import * as request from "request";
// import request from "supertest";

import { Server, HttpMethod } from "typescript-rest";
// import * as jwt from 'jsonwebtoken';
require("dotenv").config();

const apiServer = new ApiServer();
const userRequest: request.RequestAPI<request.Request, request.CoreOptions, request.RequiredUriUrl>
                = request.defaults({baseUrl: `http://localhost:${apiServer.PORT}`});


describe("User Controller Tests", () => {



    beforeAll(async () => {
        await testdb.sync({force: true});
        return apiServer.start();
    });

    afterAll(async () => {
        await testdb.close();
        return apiServer.stop();
    });

    let accessToken:string;
    // let expiredAccess:string;

    describe("The Rest Server", () => {
        it("should provide a catalog containing the exposed paths", () => {
            expect(Server.getPaths()).toEqual([
                "/user", "/user/:userid", "/new", "/todo", "/todo/:date", "/todo/:todoid"
            ]);
            expect(Server.getHttpMethods("/new")).toEqual([HttpMethod.POST]);
            expect(Server.getHttpMethods("/user")).toEqual([HttpMethod.POST]);
            expect(Server.getHttpMethods("/user/:userid")).toEqual([HttpMethod.DELETE, HttpMethod.GET]);
        });
    });

    describe("POST /new", () => {
        it("should respond success message", done => {
            userRequest.post({
                body: {email: "test@gmail.com", nickname: "testUser", password: "hereistest"},
                json: true,
                url: "/new"
            }, (error, response, body) => {
                if(error) throw error;
                expect(response.statusCode).toBe(200);
                expect(body).toBe("Sign up is successful");
                done();
            });
        });

        it("should respond conflict with existing user", done => {
            userRequest.post({
                body: {email: "test@gmail.com", nickname: "testUser", password: "hereistest"},
                json: true,
                url: "/new"
            }, (error, response, body) => {
                if(error) throw error;
                expect(response.statusCode).toBe(409);
                expect(response.statusMessage).toBe("Conflict");
                done();
            });
        });
    });

    describe("POST /user", () => {

        it("should respond success message", done => {
            userRequest.post({
                body: {email: "test@gmail.com", password: "hereistest"},
                json: true,
                url: "/user"
            }, (error, response, body) => {
                if(error) throw error;
                expect(response.statusCode).toBe(200);
                expect(typeof body).toBe("object");
                accessToken = body.accessToken;
                done();
            });
        });

        it ("should respond INCORRECT PASSWORD with invalid password information", done => {
            userRequest.post({
                body: {email: "test@gmail.com", password: "wrongpw"},
                json: true,
                url: "/user"
            }, (error, response, body) => {
                if(error) throw error;
                expect(response.statusCode).toBe(401);
                expect(response.statusMessage).toBe("Unauthorized");
                done();
            });
        });

        it ("should respond INVALID EMAIL with invalid email information", done => {
            userRequest.post({
                body: {email: "wrong@gmail.com", password: "hereistest"},
                json: true,
                url: "/user"
            }, (error, response, body) => {
                if(error) throw error;
                expect(response.statusCode).toBe(401);
                expect(response.statusMessage).toBe("Unauthorized");
                done();
            });
        });
    });

    describe("GET /user/:userid", () => {

        it ("should respond error with invalid user", done => {
            userRequest.get({
                url: "/user/2"
            }, (error, response, body) => {
                if(error) throw error;
                expect(response.statusCode).toBe(500);
                expect(response.statusMessage).toBe("Internal Server Error");
                //! 에러처리 전체적으로 세부화
                done();
            });
        });

        it ("should respond success message", done => {
            userRequest.get({
                url: "/user/1"
            }, (error, response, body) => {
                if(error) throw error;
                expect(response.statusCode).toBe(200);
                expect(typeof body).toBe("string");
                //* 토큰
                done();
            });
        });


        // it ('should respond refresh token already deleted message', done => {
        //     userRequest.delete({
        //         headers: {authentication: accessToken},
        //         url: '/user/1'
        //     }, (error, response, body) => {
        //         if(error) throw error
        //         expect(response.statusCode).toBe(409);
        //         expect(response.statusMessage).toBe('Conflict');
        //         done();
        //     })
        // });
    });

    describe("DELETE /user/:userid", () => {

        // it ('should respond JWT token error with expired access token', done => {
        //     expiredAccess = jwt.sign({
        //         id: 1,
        //         nickname: 'testUser',
        //         email: 'test@gmail.com'
        //     }, process.env.JWT_SECRET_ACCESS, { expiresIn: '0.1s'}); 

        //     userRequest.delete({
        //         headers: {authentication: expiredAccess},
        //         url: '/user/1'
        //     }, (error, response, body) => {
        //         if(error) throw error
        //         expect(response.statusCode).toBe(500);
        //         expect(response.statusMessage).toBe('Internal Server Error');
        //         // expect(body).toBe("hi");
        //         //! 에러처리 전체적으로 세부화
        //         done();
        //     })
        // });

        it ("should respond JWT token error with invalid access token", done => {
            userRequest.delete({
                headers: {authentication: "randomtoken"},
                url: "/user/1"
            }, (error, response, body) => {
                if(error) throw error;
                expect(response.statusCode).toBe(500);
                expect(response.statusMessage).toBe("Internal Server Error");
                // expect(body).toBe("hi");
                //! 에러처리 전체적으로 세부화
                done();
            });
        });

        it ("should respond success message", done => {
            userRequest.delete({
                headers: {authentication: accessToken},
                url: "/user/1"
            }, (error, response, body) => {
                if(error) throw error;
                expect(response.statusCode).toBe(200);
                expect(body).toBe("Refresh token is successfully deleted");
                done();
            });
        });


        it ("should respond refresh token already deleted message", done => {
            userRequest.delete({
                headers: {authentication: accessToken},
                url: "/user/1"
            }, (error, response, body) => {
                if(error) throw error;
                expect(response.statusCode).toBe(409);
                expect(response.statusMessage).toBe("Conflict");
                done();
            });
        });
    });




});