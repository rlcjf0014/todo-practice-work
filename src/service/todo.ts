/* eslint-disable class-methods-use-this */
import { Errors } from "typescript-rest";
import { Todo, TodoModel } from "../models/Todo";
import { addtodo, updatetodo } from "../types/interface";


export default class todo {
    public async addService(newinfo:addtodo, userId:number):Promise<TodoModel> {
        return Todo.create({
            content: newinfo.content, date: newinfo.date, userId, complete: newinfo.complete,
        })
            .then((res) => res);
    }

    public async updateService(updateinfo:updatetodo, userId:number):Promise<TodoModel> {
        return Todo.findOne({ where: { id: updateinfo.id, userId } })
            .then((result) => {
                if (result === null) {
                    throw new Errors.NotFoundError("User not found");
                }
                // eslint-disable-next-line no-param-reassign
                result.complete = updateinfo.complete;
                return result.save();
            });
    }

    public async getService(userId:number, date:string):Promise<Array<TodoModel>> {
        return Todo.findAll({ where: { userId, date } })
            .then((res) => res);
    }

    public async deleteService(todoid:number, userId:number):Promise<string> {
        return Todo.destroy({ where: { id: todoid, userId } })
            .then((res) => {
                if (res === 1) {
                    return "Successfully deleted todo";
                }

                throw new Errors.NotFoundError("No todo found");
            });
    }
}
