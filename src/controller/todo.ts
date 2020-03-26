import {
  POST, PathParam, Path, DELETE, PUT, GET, HeaderParam,
} from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { todo } from '../service/todo';
import { TodoModel } from '../models/Todo';
import { addtodo, updatetodo } from '../types/interface';
import { token } from '../service/token';

@Path('/todo')
export class TodoController {
    @Inject
    private todoService:todo;

    @Inject
    private tokenService:token;

    @POST
    public async addTodo(newinfo:addtodo, @HeaderParam('authentication') authentication:string): Promise<string|TodoModel> {
      await this.tokenService.checkAccessToken(authentication);
      const userId:number = await this.tokenService.getUserIdbyAccessToken(authentication);
      const result:TodoModel = await this.todoService.addService(newinfo, userId);
      return result;
    }


    @PUT
    public async updateTodo(updateinfo:updatetodo, @HeaderParam('authentication') authentication:string): Promise<string> {
      await this.tokenService.checkAccessToken(authentication);
      const userId:number = await this.tokenService.getUserIdbyAccessToken(authentication);
      await this.todoService.updateService(updateinfo, userId);
      return 'Sucessfully updated todo';
    }

    @GET
    @Path(':date')
    public async getTodo(@PathParam('date') date: string, @HeaderParam('authentication') authentication:string):Promise<Array<TodoModel>> {
      await this.tokenService.checkAccessToken(authentication);
      const userId:number = await this.tokenService.getUserIdbyAccessToken(authentication);
      const result:Array<TodoModel> = await this.todoService.getService(userId, date);
      return result;
    }


    @DELETE
    @Path(':todoid')
    public async deleteTodo(@PathParam('todoid') todoid: number, @HeaderParam('authentication') authentication:string): Promise<string> {
      await this.tokenService.checkAccessToken(authentication);
      const userId:number = await this.tokenService.getUserIdbyAccessToken(authentication);
      return await this.todoService.deleteService(todoid, userId);
    }
}
