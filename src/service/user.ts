import {User} from "../../models/user";
import {signup, login} from "../types/interface";

export class createuser {
    public async createuser (newinfo:signup):Promise<boolean> {
        return await User
          .findOrCreate({where:{email: newinfo.email},
            defaults:{
              email: newinfo.email,
              nickname: newinfo.nickname,
              password: newinfo.password    
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
    public async checkuser (userinfo:login):Promise<boolean> {
        return await User
        .findOne({where:{email: userinfo.email, password: userinfo.password}})
        .then((res) => {
            if (res){
                return true;
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



