import { Errors } from "typescript-rest";
import { Todo, TodoModel } from "../models/Todo";
import { addtodo, updatetodo } from "../types/interface";


export class todo {
  public async addService(newinfo:addtodo, userId:number):Promise<TodoModel> {
    return await Todo.create({
      content: newinfo.content, date: newinfo.date, userId, complete: newinfo.complete,
    })
      .then((res) => {
        if (res === null){
          throw new Errors.ConflictError("Query Failed Error");
        }
        return res;
        });
  }

  public async updateService(updateinfo:updatetodo, userId:number):Promise<TodoModel> {
    return await Todo.findOne({ where: { id: updateinfo.id, userId } })
      .then((todo) => {
        if (todo === null) {
          throw new Errors.NotFoundError("User not found");
        }
          todo.complete = updateinfo.complete;
          return todo.save();
      });
  }

  public async getService(userId:number, date:string):Promise<Array<TodoModel>> {
    return await Todo.findAll({ where: { userId, date } })
      .then((res) => {
        if (res === null){
          throw new Errors.NotFoundError("Date not found");
        }
        return res
      });
  }

  public async deleteService(todoid:number, userId:number):Promise<string> {
    return await Todo.destroy({ where: { id: todoid, userId } })
      .then((res) => {
      if (res === 1){
        return "Successfully deleted todo";
      }
      else {
        throw new Errors.NotFoundError("No todo found");
      }
      });
  }
}
