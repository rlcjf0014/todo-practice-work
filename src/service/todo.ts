import { Errors } from "typescript-rest";
import { Todo, TodoModel } from "../models/Todo";
import { addtodo, updatetodo } from "../types/interface";


export class todo {
  public async addService(newinfo:addtodo, userId:number):Promise<TodoModel> {
    return await Todo.create({
      content: newinfo.content, date: newinfo.date, userId, complete: newinfo.complete,
    })
      .then((res) => res)
      .catch((error) => {
        throw new Errors.InternalServerError(error);
      });
  }

  public async updateService(updateinfo:updatetodo, userId:number):Promise<TodoModel> {
    return await Todo.findOne({ where: { id: updateinfo.id, userId } })
      .then((todo) => {
          todo.complete = updateinfo.complete;
          return todo.save();
      }).catch((error) => {
        throw new Errors.NotFoundError(error);
      });
  }

  public async getService(userId:number, date:string):Promise<Array<TodoModel>> {
    return await Todo.findAll({ where: { userId, date } })
      .then((res) => res)
      .catch((error) => {
        throw new Errors.NotFoundError(error);
      });
  }

  public async deleteService(todoid:number, userId:number):Promise<string> {
    return await Todo.destroy({ where: { id: todoid, userId } })
      .then((res) => {
      if (res === 1){
        return "Successfully deleted todo";
      }
      else {
        throw new Errors.ConflictError("No todo with that id");
      }
      });
  }
}
