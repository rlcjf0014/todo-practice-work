import * as jwt from 'jsonwebtoken';
import { Errors } from 'typescript-rest';
import { User } from '../models/User';

require('dotenv').config();

export class token {
    private refreshKey:any = process.env.JWT_SECRET_REFRESH;

    private accessKey:any = process.env.JWT_SECRET_ACCESS;

    public generateRefreshToken(id:number):string {
      try {
        return jwt.sign({ id }, this.refreshKey, { expiresIn: '90d' });
      } catch (e) {
        throw new Errors.ConflictError(e);
      }
    }

    public getUserIdbyAccessToken(authorization:string|undefined):number {
      try {
        const decode:any = jwt.verify(authorization, this.accessKey);
        const userId = decode.id;
        return userId;
      } catch (e) {
        throw new Errors.ConflictError(e);
      }
    }

    public getUserIdbyRefreshToken(refreshToken:string):number {
      try {
        const decode:any = jwt.verify(refreshToken, this.refreshKey);
        const userId = decode.id;
        return userId;
      } catch (e) {
        throw new Errors.ConflictError(e);
      }
    }

    public generateAccessToken(user:User):string {
      try {
        return jwt.sign({
          id: user.userid,
          nickname: user.nickname,
          email: user.email,
          createAt:
            user.creationDate,
        }, this.accessKey, { expiresIn: '1d' });
      } catch (e) {
        throw new Errors.ConflictError(e);
      }
    }

    public checkRefreshToken(refreshToken:string):boolean {
      try {
        jwt.verify(refreshToken, this.refreshKey);
        return true;
      } catch (e) {
        throw new Errors.ForbiddenError(e);
      }
    }

    public checkAccessToken(accessToken:string):boolean {
      try {
        jwt.verify(accessToken, this.accessKey);
        return true;
      } catch (e) {
        throw new Errors.ForbiddenError(e);
      }
    }
}
