/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import { Inject } from "typescript-ioc";
import { Errors } from "typescript-rest";
import { User } from "../models/User";
import { signup, login } from "../types/interface";
import createSalt from "./crypto";
import token from "./token";


export default class user {
    @Inject
    private pwService:createSalt;

    public async createuser(newinfo:signup):Promise<string> {
        const salt:string = await this.pwService.getRandomByte();
        const secretpw:string = await this.pwService.getEncryPw(newinfo.password, salt);

        return User
            .findOrCreate({
                where: { email: newinfo.email },
                defaults: {
                    email: newinfo.email,
                    nickname: newinfo.nickname,
                    password: secretpw,
                    salt,
                },
            })
            .spread((memo, created) => {
                if (created) {
                    return "Sign up is successful";
                }

                throw new Errors.ConflictError("User already exists");
            });
    }


    @Inject
    private tokenService:token;

    public async checkuser(userinfo:login):Promise<object> {
        return User
            .findOne({ where: { email: userinfo.email } })
            .then(async (res) => {
                if (res) {
                    const secretpw:string = await this.pwService.getEncryPw(userinfo.password, res.salt);
                    if (secretpw === res.password) {
                        const newAccessToken:string = this.tokenService.generateAccessToken(res);
                        const newRefreshToken:string = this.tokenService.generateRefreshToken(res.userid);
                        return User.update({ refreshToken: newRefreshToken }, { where: { email: userinfo.email } })
                            .then(() => ({ accessToken: newAccessToken }));
                    }

                    throw new Errors.UnauthorizedError("Incorrect Password");
                } else {
                    throw new Errors.UnauthorizedError("Invalid Email");
                }
            });
    }

    public async deletetoken(userid: number): Promise<string> {
        return User
            .update({
                refreshToken: null,
            }, { where: { userid } })
            .then((res) => {
                if (res[0] === 1) {
                    return "Refresh token is successfully deleted";
                }
                throw new Errors.NotFoundError("User not found");
                // throw new Errors.ConflictError("Query Failed Error");
            });
    }

    public async renewToken(userid: number): Promise<object> {
        return User.findOne({ where: { userid } })
            .then(async (res) => {
                if (res === null) {
                    throw new Errors.NotFoundError("User not found");
                }
                if (res.refreshToken === null) {
                    throw new Errors.ConflictError("Refresh token invalid. Please login again");
                }
                this.tokenService.checkRefreshToken(res.refreshToken);
                const newAccessToken:string = this.tokenService.generateAccessToken(res);
                return { accessToken: newAccessToken };
            });
    }
}
