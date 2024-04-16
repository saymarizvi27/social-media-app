import { User } from "@prisma/client";
import Dataloader from "dataloader";
import  { prisma } from "../index";

type batchUsers = (ids: number[]) => Promise<User[]>

const batchUsers = async(ids : number[]) =>{
     console.log(ids);
     console.log('hiiiiiii')
     const users = await prisma.user.findMany({
        where : {
            id: {
                in : ids
            }
        }
    });

    const userMap: { [key: string]: User } = {};
    users.forEach((user)=>{
        console.log(user);
        return userMap[user.id] = user
    })

    const a =  ids.map((id)=>{
        console.log(id);
        return userMap[id]
    })

    console.log(a);
    return a;


}

//@ts-ignore
export const userLoader = new Dataloader<number, User>(batchUsers);

