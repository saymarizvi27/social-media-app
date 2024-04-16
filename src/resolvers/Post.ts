import { Context } from "../index";
import { userLoader } from "../loaders/userLoader";
interface PostParentType {
    authorId : number 
}

export const Post = {
    user : ({ authorId }:PostParentType , __:any , {prisma }: Context ) => {
        return userLoader.load(authorId); 
    }
};
