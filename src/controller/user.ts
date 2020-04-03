import {
    POST, PathParam, HeaderParam, Path, DELETE, GET,
} from "typescript-rest";
import { Inject } from "typescript-ioc";
import { Tags } from "typescript-rest-swagger";
import { checkuser, deletetoken, renewAccess } from "../service/user";
import token from "../service/token";
import { login } from "../types/interface";

require("dotenv").config();


@Path("/user")
@Tags("User")
export default class UserController {
    @Inject
    private checkService: checkuser;

    @Inject
    private deleteService: deletetoken;

    @Inject
    private renewService: renewAccess;

    @POST
    public async login(userinfo:login): Promise<object> {
        const result:object = await this.checkService.checkuser(userinfo);
        return result;
    }

    @Inject
    private tokenService: token;

    @Path(":userid")
    @DELETE
    public async logout(@PathParam("userid") userid: number, @HeaderParam("Authorization") Authorization:string): Promise<string> {
        await this.tokenService.checkAccessToken(Authorization);
        return this.deleteService.deletetoken(userid);
    }


    @Path(":userid")
    @GET
    public async renewToken(@PathParam("userid") userid: number): Promise<object> {
        return this.renewService.renewToken(userid);
    }
}
