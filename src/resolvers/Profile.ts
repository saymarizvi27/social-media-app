import { Context } from "../index";

interface ProfileParentType {
    id : number , 
    bio : string , 
    userId : number 
}

export const Profile = {
    user : async ({ id , bio , createAt , updatedAt , userId }:any , __:any , {prisma }: Context ) => {
        const user = await prisma.user.findUnique({
            where : {
                id : userId
            }
        })

        return user; 
    }
};
