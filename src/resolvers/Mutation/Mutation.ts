import { postResolvers } from "./post";
import { authResolver } from "./auth";

export const Mutation = {
    ...postResolvers,
    ...authResolver
}