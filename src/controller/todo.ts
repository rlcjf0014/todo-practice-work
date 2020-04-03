import {
    POST, PathParam, Path, DELETE, PUT, GET, HeaderParam,
} from "typescript-rest";
import { Inject } from "typescript-ioc";
import { Tags } from "typescript-rest-swagger";
import todo from "../service/todo";
import { TodoModel } from "../models/Todo";
import { addtodo, updatetodo } from "../types/interface";
import token from "../service/token";

@Path("/todo")
@Tags("Todo")
export default class TodoController {
    @Inject
    private todoService:todo;

    @Inject
    private tokenService:token;

    @POST
    public async addTodo(newinfo:addtodo, @HeaderParam("Authorization") Authorization:string): Promise<string|TodoModel> {
        await this.tokenService.checkAccessToken(Authorization);
        const userId:number = await this.tokenService.getUserIdbyAccessToken(Authorization);
        const result:TodoModel = await this.todoService.addService(newinfo, userId);
        return result;
    }


    @PUT
    public async updateTodo(updateinfo:updatetodo, @HeaderParam("Authorization") Authorization:string): Promise<string> {
        await this.tokenService.checkAccessToken(Authorization);
        const userId:number = await this.tokenService.getUserIdbyAccessToken(Authorization);
        await this.todoService.updateService(updateinfo, userId);
        return "Successfully updated todo";
    }

    @GET
    @Path(":date")
    public async getTodo(@PathParam("date") date: string, @HeaderParam("Authorization") Authorization:string):Promise<Array<TodoModel>> {
        await this.tokenService.checkAccessToken(Authorization);
        const userId:number = await this.tokenService.getUserIdbyAccessToken(Authorization);
        const result:Array<TodoModel> = await this.todoService.getService(userId, date);
        return result;
    }


    @DELETE
    @Path(":todoid")
    public async deleteTodo(@PathParam("todoid") todoid: number, @HeaderParam("Authorization") Authorization:string): Promise<string> {
        await this.tokenService.checkAccessToken(Authorization);
        const userId:number = await this.tokenService.getUserIdbyAccessToken(Authorization);
        return this.todoService.deleteService(todoid, userId);
    }
}
