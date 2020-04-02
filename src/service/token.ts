import * as jwt from "jsonwebtoken";
// import { Errors } from 'typescript-rest';
import { User } from "../models/User";
// import { Errors } from "typescript-rest";

require("dotenv").config();

export class token {
    private refreshKey:any = process.env.JWT_SECRET_REFRESH;

    private accessKey:any = process.env.JWT_SECRET_ACCESS;

    public generateRefreshToken(id:number):string {
      
        return jwt.sign({ id }, this.refreshKey, { expiresIn: "90d" });
     
    }

    public getUserIdbyAccessToken(authorization:string|undefined):number {
        const process:string = authorization.split(" ")[1];
        const decode:any = jwt.verify(process, this.accessKey);
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
        }, this.accessKey, { expiresIn: "1d" });
      
    }

    public checkRefreshToken(refreshToken:string):void {
        jwt.verify(refreshToken, this.refreshKey);
    }

    public checkAccessToken(accessToken:string):void {
        const process:string = accessToken.split(" ")[1];
        jwt.verify(process, this.accessKey);
    }
}
