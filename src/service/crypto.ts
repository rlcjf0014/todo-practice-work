import * as crypto from "crypto";
import * as util from "util";

export class createSalt {
    
    public async getEncryPw(password:string, salt:string):Promise<string> {
        const pdkdf2Promise:Function = util.promisify(crypto.pbkdf2);
        const key:Buffer = await pdkdf2Promise(password, salt, 105123, 64, "sha512");
        return key.toString("base64");
    }

    public async getRandomByte():Promise<string> {
        const randomBytesPromise:Function = util.promisify(crypto.randomBytes);
        const buf:Buffer = await randomBytesPromise(64);
        return buf.toString("base64");
    }
}