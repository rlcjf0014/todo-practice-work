import {User} from "../models/User";
import {signup, login} from "../types/interface";
import {createSalt} from "./crypto";
import {token} from "./token"
import { Inject } from "typescript-ioc";

export class createuser {
    @Inject
    private pwService:createSalt;

    public async createuser (newinfo:signup):Promise<boolean> {
        const salt:string = await this.pwService.getRandomByte();
        const secretpw:string = await this.pwService.getEncryPw(newinfo.password, salt);
        
        return await User
          .findOrCreate({where:{email: newinfo.email},
            defaults:{
              email: newinfo.email,
              nickname: newinfo.nickname,
              password: secretpw,
              salt    
            }})
          .spread((memo, created) => {
              if (created){
                  return true;
              }
              else {
                  return false;
              }
          })
      }
};

export class checkuser {
    @Inject
    private pwService:createSalt;
    private tokenService:token;

    public async checkuser (userinfo:login):Promise<boolean | string> {
        return await User
        .findOne({where:{email: userinfo.email}})
        .then(async (res) => {
            if (res){
                const secretpw:string = await this.pwService.getEncryPw(userinfo.password, res.salt);
                if(secretpw === res.password) {
                    const newAccessToken:string = await this.tokenService.generateAccessToken(res);
                    const newRefreshToken:string = await this.tokenService.generateRefreshToken(res.userid);
                    return await User.update({refreshToken:newRefreshToken}, {where: {email:userinfo.email}})
                    .then((res) => {
                       if (res){
                           return newAccessToken;
                       }
                       else {
                           //* 에러 처리 필요
                           return "Saving Refresh Token Failed";
                       }    
                    })
                }
                else {
                    return 'Incorrect Password';
                }
            }
            else {
                return false;
            }
        })
    }
}

export class deletetoken {
    public async deletetoken (userid: number): Promise<boolean> {
        return await User
        .update({
            refreshToken: null
        }, {where: {userid}})
        .then(res => {
            if (res){
                return true;
            }
            else {
                return false;
            }
        })
    }

}

export class renewAccess {
    @Inject
    private tokenService:token;

    public async renewToken (userid: number): Promise<string | false>{
        return await User.findOne({where: {userid}})
        .then(async res => {
            const result:boolean = await this.tokenService.checkRefreshToken(res.refreshToken);
            if (result === true){
                const newAccessToken:string = await this.tokenService.generateAccessToken(res);
                return newAccessToken;
            }
            else {
                return false;
            }
        })
    }



}



