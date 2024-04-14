import { Post, Prisma } from "@prisma/client";
import { Context } from "../../index";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { canUserMutatePost } from "../../utils/canUserMutatePost";

interface PostArgs {
    post: {
        title?: string,
        content?: string
    }
}

interface PostPayloadType {
    userErrors: {
        message: string
    }[],
    post: Post | null | Prisma.Prisma__PostClient<Post>
}


interface PostDeleteArgs {
    id: String
}

export const postResolvers = {
    postCreate: async (parents: any, { post }: PostArgs, { prisma, userInfo }: Context): Promise<PostPayloadType> => {

        const { title, content } = post;

        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Invalid user!"
                }
                ],
                post: null
            }
        }

        if (!title || !content) {
            return {
                userErrors: [{
                    message: "You must provide a title and a content to create a post"
                }],
                post: null
            }
        }


        return {
            userErrors: [],
            post: prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: 1
                }
            })
        };
    },
    postUpdate: async (parents: any, { post, postId }: { postId: string, post: PostArgs["post"] }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Invalid user!"
                }
                ],
                post: null
            }
        }


        const { title, content } = post;

        if ((!title && !content) || postId!) {
            return {
                userErrors: [{
                    message: "You must provide a title and a content to create a post"
                }],
                post: null
            }
        }

        
        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        });

        if (error) {
            return {
                ...error,
                post: null
            }
        }

        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });

        if (!existingPost) {
            return {
                userErrors: [{
                    message: "Post does not exist"
                }],
                post: null
            }
        }

        let updatePayload = title ? { title } : {};
        content ? { updatePayload, ...{ content } } : updatePayload;


        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: Number(postId)
                },
                data: { ...updatePayload }
            })
        };
    },
    postDelete: async (parents: any, { id }: PostDeleteArgs, { prisma, userInfo }: Context): Promise<PostPayloadType> => {

        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Invalid user!"
                }
                ],
                post: null
            }
        }

        if (id!) {
            return {
                userErrors: [{
                    message: "You must provide a id to delete post"
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(id),
            prisma
        });

        if (error) {
            return {
                ...error,
                post: null
            }
        }


        const post = await prisma.post.delete({
            where: {
                id
            }
        });


        return {
            userErrors: [],
            post
        };
    },
    postPublish: async (parents: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Invalid user!"
                }
                ],
                post: null
            }
        }
        
        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        });

        if (error) {
            return {
                ...error,
                post: null
            }
        }

        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });

        if (!existingPost) {
            return {
                userErrors: [{
                    message: "Post does not exist"
                }],
                post: null
            }
        }

        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: Number(postId)
                },
                data: { published: true }
            })
        };
    },
    postUnpublish: async (parents: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [{
                    message: "Invalid user!"
                }
                ],
                post: null
            }
        }
        
        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        });

        if (error) {
            return {
                ...error,
                post: null
            }
        }

        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        });

        if (!existingPost) {
            return {
                userErrors: [{
                    message: "Post does not exist"
                }],
                post: null
            }
        }

        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: Number(postId)
                },
                data: { published: false }
            })
        };
    },

};
