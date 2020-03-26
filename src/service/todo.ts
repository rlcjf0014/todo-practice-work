import { Errors } from 'typescript-rest';
import { Todo, TodoModel } from '../models/Todo';
import { addtodo, updatetodo } from '../types/interface';


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

  public async updateService(updateinfo:updatetodo):Promise<TodoModel> {
    return await Todo.findOne({ where: { id: updateinfo.id } })
      .then((todo) => {
        if (todo.complete === 'Y') {
          todo.complete = 'C';
          return todo.save();
        }
        todo.complete = 'Y';
        return todo.save();
      }).catch((error) => {
        //! 에러처리
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

  public async deleteService(todoid:number):Promise<number> {
    return await Todo.destroy({ where: { id: todoid } })
      .then((res) => res)
      .catch((error) => {
        throw new Errors.ConflictError(error);
      });
  }
}
