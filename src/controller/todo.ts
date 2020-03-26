import {POST, PathParam, Path, DELETE, Errors, PUT, GET, HeaderParam} from "typescript-rest";
import {todo} from "../service/todo";
import {Todo} from "../models/Todo";
import {addtodo, updatetodo} from "../types/interface";
import {Inject} from "typescript-ioc";
import { token } from "../service/token";

@Path("/todo")
export class TodoController {

    @Inject
    private todoService:todo;
    @Inject
    private tokenService:token;

    @POST
    public async addTodo(newinfo:addtodo, @HeaderParam("authentication") authentication:string): Promise<string> {
        const check:boolean = await this.tokenService.checkAccessToken(authentication);
        if (check === true) {
           const userId:number = await this.tokenService.getUserIdbyAccessToken(authentication);
           const result:boolean = await this.todoService.addService(newinfo, userId);
           if (result){
               return "Successfully added a new todo";
           }
           else {
               //!에러처리
               return "Failed to add a new todo";
           }  
        }
        else {
            throw new Errors.UnauthorizedError("Access Token has expired");
        }
    }

    

    @PUT
    public async updateTodo(updateinfo:updatetodo, @HeaderParam("authentication") authentication:string): Promise<string> {
        const check:boolean = await this.tokenService.checkAccessToken(authentication);
        if (check === true) {
           const result:boolean = await this.todoService.updateService(updateinfo);
           if (result) {
            return "Sucessfully updated todo";
           }   
           else {
            //!에러처리
            return "Failed to update todo";
        }  
        }
        else {
            throw new Errors.UnauthorizedError("Access Token has expired");
        }
    }

    @GET
    @Path(":date")
    public async getTodo(@PathParam("date") date: string, @HeaderParam("authentication") authentication:string):Promise<Array<Todo>> {
        const check:boolean = await this.tokenService.checkAccessToken(authentication);
        if (check === true) {
            const userId:number = await this.tokenService.getUserIdbyAccessToken(authentication);
            const result:Array<Todo> = await this.todoService.getService(userId, date);
            return result; 
        }
        else {
            throw new Errors.UnauthorizedError("Access Token has expired");
        }
    }


    @DELETE
    @Path(":todoid")
    public async deleteTodo(@PathParam("todoid") todoid: number, @HeaderParam("authentication") authentication:string): Promise<string> {
        const check:boolean = await this.tokenService.checkAccessToken(authentication);
        if (check === true) {
            const result:boolean = await this.todoService.deleteService(todoid);
            if (result){
                return "Successfully deleted the todo";
            }
            else {
                //!에러처리
                return "Failed to delete todo";
            }    
        }
        else {
            throw new Errors.UnauthorizedError("Access Token has expired");
        }
    }


}

