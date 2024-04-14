import { Context } from "../index";

export const Query = {
    hello: () => "World!",
    posts: async (_:any ,__:any, { prisma }: Context ) => {
        const posts = await prisma.post.findMany({
            orderBy: [ { createdAt : "desc" } ]
        }) 
        return posts;
    },
    me: (_:any , __:any , {prisma , userInfo }: Context) => {
        if (!userInfo) return null;
        return prisma.user.findUnique({
            where: {
                id: userInfo.userId
            }
        })

    },
    profile: (_:any , __:any , {prisma , userInfo}: Context ) => {
        console.log('Hiiiiii')
        if (!userInfo) return null;
        return prisma.profile.findUnique({
            where: {
                userId : userInfo.userId
            }
        })  
    }
};
