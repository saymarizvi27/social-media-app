import { Context } from "../index";

interface PostParentType {
    authorId : number 
}

export const Post = {
    user : async ({ authorId }:PostParentType , __:any , {prisma }: Context ) => {
        const user = await prisma.user.findUnique({
            where : {
                id : authorId
            }
        })

        return user; 
    }
};
