import {
  POST, PathParam, HeaderParam, Path, DELETE, Errors, GET,
} from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { checkuser, deletetoken, renewAccess } from '../service/user';
import { token } from '../service/token';
import { login } from '../types/interface';

require('dotenv').config();


@Path('/user')
export class UserController {
    @Inject
    private checkService: checkuser;

    @Inject
    private deleteService: deletetoken;

    @Inject
    private renewService: renewAccess;

    @POST
    public async login(userinfo:login): Promise<string> {
      const result:boolean | string = await this.checkService.checkuser(userinfo);
      if (typeof result === 'string') {
        return result;
      }

      throw new Errors.NotFoundError('Login has failed');
    }

    @Inject
    private tokenService: token;

    @Path(':userid')
    @DELETE
    public async logout(@PathParam('userid') userid: number, @HeaderParam('authentication') authentication:string): Promise<string> {
      const check:boolean = await this.tokenService.checkAccessToken(authentication);
      if (check === true) {
        const result:boolean = await this.deleteService.deletetoken(userid);
        if (result === true) {
          return 'Refresh token is successfully deleted';
        }

        throw new Errors.ConflictError('Token deletion has failed');
      } else {
        //! 에러처리 필요
        throw new Errors.ForbiddenError('Access Token has expired');
      }
    }


    @Path(':userid')
    @GET
    public async renewToken(@PathParam('userid') userid: number): Promise<string> {
      const result:string | boolean = await this.renewService.renewToken(userid);
      if (typeof result === 'string') {
        return result;
      }

      throw new Errors.UnauthorizedError('Please Login Again');
    }
}
