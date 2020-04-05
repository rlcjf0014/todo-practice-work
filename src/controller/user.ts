import {
    POST, PathParam, HeaderParam, Path, DELETE, GET,
} from "typescript-rest";
import { Inject } from "typescript-ioc";
import { Tags } from "typescript-rest-swagger";
import user from "../service/user";
import token from "../service/token";
import { login } from "../types/interface";

require("dotenv").config();


@Path("/user")
@Tags("User")
export default class UserController {
    @Inject
    private checkService: user["checkuser"];

    @Inject
    private deleteService: user["deletetoken"];

    @Inject
    private renewService: user["renewToken"];

    @POST
    public async login(userinfo:login): Promise<object> {
        const result:object = await this.checkService(userinfo);
        return result;
    }

    @Inject
    private tokenService: token;

    @Path(":userid")
    @DELETE
    public async logout(@PathParam("userid") userid: number, @HeaderParam("Authorization") Authorization:string): Promise<string> {
        await this.tokenService.checkAccessToken(Authorization);
        return this.deleteService(userid);
    }


    @Path(":userid")
    @GET
    public async renewToken(@PathParam("userid") userid: number): Promise<object> {
        return this.renewService(userid);
    }
}
