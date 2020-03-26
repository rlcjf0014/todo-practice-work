import { POST, Path} from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { createuser } from '../service/user';
import { signup } from '../types/interface';

@Path('/new')
export class NewController {
    @Inject
    private createService: createuser;

    @POST
    public async signup(newinfo:signup): Promise<string> {
      return await this.createService.createuser(newinfo);
    }
}
