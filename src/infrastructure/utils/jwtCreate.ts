import { ObjectId } from "mongodb";
import Ijwt from "../../use_case/interface/jwt";
import jwt from "jsonwebtoken"

class JwtCreate implements Ijwt{
    createJwt(Id:string): string {
        const jwtKey = process.env.JWT_KEY
        if(jwtKey){
            const token:string = jwt.sign(
                {id:Id},
                jwtKey
            );
            return token
        }
        throw new Error("JWT_KEY is not defined");
    }
}

export default JwtCreate