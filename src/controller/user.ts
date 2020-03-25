import {POST, PathParam, Path, DELETE, Errors, GET} from "typescript-rest";
import {checkuser, deletetoken, renewAccess} from "../service/user";
import {login} from "../types/interface";
import {Inject} from "typescript-ioc";
require("dotenv").config();


@Path("/user")
export class UserController {
    
    @Inject
    private checkService: checkuser;
    private deleteService: deletetoken;
    private renewService: renewAccess;

    @POST
    public async login(userinfo:login): Promise<string> {
        const result:boolean | string = await this.checkService.checkuser(userinfo);
        if (typeof result === 'string'){
            return result;
        }
        else {
            throw new Errors.NotFoundError("Login has failed");
        }
    }

    @Path(":userid")
    @DELETE
    public async logout(@PathParam("userid") userid: number): Promise<string> {
        const result:boolean = await this.deleteService.deletetoken(userid);
        if (result === true){
            return "Refresh token is successfully deleted";
        }
        else {
            throw new Errors.ConflictError("Token deletion has failed");
        }
    }

    @Path(":userid")
    @GET
    public async renewToken(@PathParam("userid") userid: number): Promise<string>{
        const result:string | boolean = await this.renewService.renewToken(userid);
        if (result){
            return result;
        }
        else {
            throw new Errors.UnauthorizedError("Please Login Again");
        }
    }


}

