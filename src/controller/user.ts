import {POST, PathParam, Path, DELETE} from "typescript-rest";
import {createuser, checkuser, deletetoken} from "../service/user";
import {signup, login} from "../types/interface";
import {Inject} from "typescript-ioc";

@Path("/user")
export class UserController {

    @Inject
    private createService: createuser;

    @Path("/new")
    @POST
    public async signup(newinfo:signup): Promise<string> {
      const result:boolean = await this.createService.createuser(newinfo);
      if (result === true){
          return "Signup is successful";
      }
      else {
          return "Signup has failed";
      }
    }

    @Inject
    private checkService: checkuser;

    @POST
    public async login(userinfo:login): Promise<string> {
        const result:boolean = await this.checkService.checkuser(userinfo);
        if (result === true){
            return "Login is successful";
        }
        else {
            return "Login has failed";
        }

    }

    @Inject
    private deleteService: deletetoken;

    @DELETE
    @Path(":userid")
    public async logout(@PathParam("userid") userid: number): Promise<string> {
        const result:boolean = await this.deleteService.deletetoken(userid);
        if (result === true){
            return "Refresh token is successfully deleted";
        }
        else {
            return "Refresh token deletion has failed";
        }

    }



}

