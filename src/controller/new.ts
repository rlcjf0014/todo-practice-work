import { POST, Path, } from "typescript-rest";
import { Inject } from "typescript-ioc";
import { createuser } from "../service/user";
import { signup } from "../types/interface";
import {Tags} from "typescript-rest-swagger";


@Path("/new")
export class NewController {
  @Inject
  private createService: createuser;
  
  @POST
  @Tags("User")
  // @Response<string>(409, "This user is already signed up", "User already exists")
  // @Response<string>(500, "Invalid Input Value for Sign Up", "Invalid Input Value")
    public async signup(newinfo:signup): Promise<string> {
      return await this.createService.createuser(newinfo);
    }
}
