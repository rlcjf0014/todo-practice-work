import {Todo} from "../models/Todo";
import {addtodo, updatetodo} from "../types/interface";
import { Errors } from "typescript-rest";


export class todo {
   
    public async addService (newinfo:addtodo, userId:number):Promise<boolean> {
      return await Todo.create({content: newinfo.content, date:newinfo.date, userId, complete:newinfo.complete})
        .then(res => {
                return true;
        })
        .catch(error => {
            throw new Errors.ConflictError(error) 
        })
    }

    public async updateService (updateinfo:updatetodo):Promise<boolean> {
        const result:Todo|void = await Todo.findOne({where: {id: updateinfo.id}})
          .then(todo => {
              if (todo.complete === "Y"){
                  todo.complete = "C";
                  return todo.save();
              }
              else {
                  todo.complete = "Y";
                  return todo.save();
              }
          }).catch(error => {
              //! 에러처리
              throw new Errors.ConflictError(error)
          })
        if (result){
            return true;
        }
        else {
            return false;
        }   
    }

    public async getService (userId:number, date:string):Promise<Array<Todo>> {
        return await Todo.findAll({where: {userId, date}})
          .then(res => {
              return res;
          })
          .catch(error => {
            throw new Errors.ConflictError(error)
          })
    }

    public async deleteService (todoid:number):Promise<boolean> {
        return await Todo.destroy({where: {id: todoid}})
            .then(() => {
                return true;
            })
            .catch((error) => {
                throw new Errors.ConflictError(error)
            })
    }


}