import { JWT_SECRET } from "../config/index.js";
import  Jwt  from "jsonwebtoken";


class JwtServices{
    static sign(payload, expiry = '1y', secret = JWT_SECRET ){

        return Jwt.sign(payload, secret, {expiresIn: expiry});
    }
    static verify(token,  secret = JWT_SECRET ){

        return Jwt.verify(token, secret);
    }
}

export default JwtServices;