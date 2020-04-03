import { POST, Path } from "typescript-rest";
import { Inject } from "typescript-ioc";
import { Tags } from "typescript-rest-swagger";
import createuser from "../service/user";
import { signup } from "../types/interface";


@Path("/new")
export default class NewController {
  @Inject
  private createService: createuser;

  @POST
  @Tags("User")
  // @Response<string>(409, "This user is already signed up", "User already exists")
  // @Response<string>(500, "Invalid Input Value for Sign Up", "Invalid Input Value")
  public signup(newinfo:signup): Promise<string> {
      return this.createService.createuser(newinfo);
  }
}
