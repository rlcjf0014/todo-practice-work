import * as jwt from "jsonwebtoken"
require("dotenv").config();
import {User} from "../models/User";

export class token { 
    private refreshKey:any = process.env.JWT_SECRET_REFRESH;
    private accessKey:any = process.env.JWT_SECRET_ACCESS;

    public generateRefreshToken(id:number):string {
            return jwt.sign({id}, this.refreshKey, {expiresIn: "90d" });
    }

    public getUserIdbyAccessToken(authorization:string|undefined):number{
        // const accessToken:string|undefined = authorization && authorization.split(" ")[1];
        //if (!accessToken) throw new CustomError("Token is required", 401, "Fail to get accessToken in header");

        const decode:any = jwt.verify(authorization, this.accessKey);
        const userId = decode.id;

        return userId;
    }

    public getUserIdbyRefreshToken(refreshToken:string):number {
        const decode:any = jwt.verify(refreshToken, this.refreshKey);
        const userId = decode.id;
    
        return userId;
    }

    public generateAccessToken(user:User):string {
        return jwt.sign({
            id: user.userid,
            nickname: user.nickname,
            email: user.email,
            createAt:
            user.creationDate,
        }, this.accessKey, { expiresIn: "1d" })
    }

    public checkRefreshToken(refreshToken:string):boolean {
        try{
            jwt.verify(refreshToken, this.refreshKey);
            return true;
        }
        catch (e) {
            return false;
        }

    }

    public checkAccessToken(accessToken:string):boolean {
        try{
            jwt.verify(accessToken, this.accessKey);
            return true;
        }
        catch(e) {
            return false;
        }
    }
    
}