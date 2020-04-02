import { Inject } from "typescript-ioc";
import { Errors } from "typescript-rest";
import { User} from "../models/User";
import { signup, login } from "../types/interface";
import { createSalt } from "./crypto";
import { token } from "./token";

export class createuser {
    @Inject
    private pwService:createSalt;

    public async createuser(newinfo:signup):Promise<string> {
      const salt:string = await this.pwService.getRandomByte();
      const secretpw:string = await this.pwService.getEncryPw(newinfo.password, salt);

      return await User
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
          else {
            throw new Errors.ConflictError("User already exists");
          }
        })
    }
}

export class checkuser {
    @Inject
    private pwService:createSalt;

    @Inject
    private tokenService:token;

    public async checkuser(userinfo:login):Promise<object> {
      return await User
        .findOne({ where: { email: userinfo.email } })
        .then(async (res) => {
          if (res){
            const secretpw:string = await this.pwService.getEncryPw(userinfo.password, res.salt);
            if (secretpw === res.password) {
              const newAccessToken:string = await this.tokenService.generateAccessToken(res);
              const newRefreshToken:string = await this.tokenService.generateRefreshToken(res.userid);
              return await User.update({ refreshToken: newRefreshToken }, { where: { email: userinfo.email } })
                .then(() => {return {accessToken: newAccessToken};})
                .catch((e) => {
                  throw new Errors.ConflictError(e);
                });
            }
            else{
              throw new Errors.UnauthorizedError("Incorrect Password");
            }
          }
          else {
            throw new Errors.UnauthorizedError("Invalid Email");
          }
          });
    }
}

export class deletetoken {
  public async deletetoken(userid: number): Promise<string> {
    return await User
      .update({
        refreshToken: null,
      }, { where: { userid } })
      .then((res) => {
        if (res[0] === 1){
          return "Refresh token is successfully deleted";
        }
        throw new Errors.NotFoundError("User not found");
        // throw new Errors.ConflictError("Query Failed Error");
      });
  }
}

export class renewAccess {
    @Inject
    private tokenService:token;

    public async renewToken(userid: number): Promise<object> {
      return await User.findOne({ where: { userid } })
        .then(async (res) => {
          console.log("값은?", res)
          if (res === null){
            throw new Errors.NotFoundError("User not found");
          }
          if (res.refreshToken === null){
            throw new Errors.ConflictError("Refresh token expired. Please login again")
          }
          await this.tokenService.checkRefreshToken(res.refreshToken);
          const newAccessToken:string = await this.tokenService.generateAccessToken(res);
          return {accessToken: newAccessToken};
        });
    }
}
