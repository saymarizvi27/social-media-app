import { ApolloServer, gql } from "apollo-server";
import { typeDefs } from "./schema"
import { Mutation, Query , Profile , Post , User } from "./resolvers";
import { PrismaClient , Prisma } from "@prisma/client"
import { getUserFromToken } from "./utils/getUserFromToken";

export const prisma = new PrismaClient();

export interface Context {
    prisma : PrismaClient,
    userInfo: {
        userId: number 
    } | null
}

const server = new ApolloServer({
    typeDefs,
    resolvers: {
        Query,
        Mutation,
        Profile,
        Post,
        User
    },
    context: async ({req}: any) : Promise <Context>=> {
        let userInfo = null;
        if (req.headers.authorization){
            userInfo = await getUserFromToken(req.headers.authorization);

        };
        return { 
            prisma,
            userInfo
        }
    }
})

server.listen().then(({ url }) => {
    console.log(`Server ready on ${url}`);
})