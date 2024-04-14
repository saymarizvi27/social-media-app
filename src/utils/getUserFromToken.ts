import JWT from "jsonwebtoken"
import { JSON_SIGNATURE } from "../keys"
export const getUserFromToken = (token:string) => {
    try {
        return JWT.verify(token , JSON_SIGNATURE) as {
            userId: number;
        }

    } catch (error){
        console.log('Error occured ' , error);
        return null;
    }
}