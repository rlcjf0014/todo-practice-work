import * as jwt from "jsonwebtoken";
// import { Errors } from 'typescript-rest';
import { User } from "../models/User";

require("dotenv").config();

export class token {
    private refreshKey:any = process.env.JWT_SECRET_REFRESH;

    private accessKey:any = process.env.JWT_SECRET_ACCESS;

    public generateRefreshToken(id:number):string {
      
        return jwt.sign({ id }, this.refreshKey, { expiresIn: "90d" });
     
    }

    public getUserIdbyAccessToken(authorization:string|undefined):number {
      
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
        }, this.accessKey, { expiresIn: "1d" });
      
    }

    public checkRefreshToken(refreshToken:string):boolean {
      
        jwt.verify(refreshToken, this.refreshKey);
        return true;
      
    }

    public checkAccessToken(accessToken:string):boolean {
      
        jwt.verify(accessToken, this.accessKey);
        return true;
     
    }
}
