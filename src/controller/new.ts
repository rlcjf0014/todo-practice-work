import { POST, Path, Errors } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { createuser } from '../service/user';
import { signup } from '../types/interface';

@Path('/new')
export class NewController {
    @Inject
    private createService: createuser;

    @POST
    public async signup(newinfo:signup): Promise<string> {
      const result:boolean = await this.createService.createuser(newinfo);
      if (result === true) {
        return 'Signup is successful';
      }

      throw new Errors.ConflictError('Signup has failed');
    }
}
