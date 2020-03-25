import {POST, PathParam, Path, DELETE, Errors, PUT, GET} from "typescript-rest";
import {createuser, checkuser, deletetoken} from "../service/user";
import {signup, login} from "../types/interface";
import {Inject} from "typescript-ioc";

@Path("/todo")
export class TodoController {

    @Inject
    private createService: createuser;
)
    @POST
    public async addTodo(newinfo:signup): Promise<string> {
      
    }

    

    @PUT
    public async updateTodo(userinfo:login): Promise<string> {
       
    }

    @GET
    @Path(":date")
    public async getTodo(@PathParam("todoid") todoid: number) {
        
    }


    @DELETE
    @Path(":todoid")
    public async deleteTodo(@PathParam("userid") userid: number): Promise<string> {
       
    }


}

