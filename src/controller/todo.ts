import {POST, PathParam, Path, DELETE, Errors} from "typescript-rest";
import {createuser, checkuser, deletetoken} from "../service/user";
import {signup, login} from "../types/interface";
import {Inject} from "typescript-ioc";

@Path("/todo")
export class TodoController {

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
          throw new Errors.ConflictError("Signup has failed");
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
            throw new Errors.NotFoundError("Login has failed");
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
            throw new Errors.ConflictError("Token deletion has failed");
        }
    }
}

