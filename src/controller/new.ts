import {POST, Path, Errors} from "typescript-rest";
import {createuser} from "../service/user";
import {signup} from "../types/interface";
import {Inject} from "typescript-ioc";

@Path("/new")
export class UserController {

    @Inject
    private createService: createuser;

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

}

