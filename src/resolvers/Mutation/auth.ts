import { Prisma, User } from "@prisma/client";
import { Context } from "../../index"
import validator from "validator";
import bcypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { JSON_SIGNATURE } from "../../keys";


interface SignUpArgs {
    credentials: {
        email: string,
        password: string
    },
    name: string,
    bio: string,
   
}

interface UserPayload {
    userErrors: {
        message: string
    }[],
    token: string | null;
}


export const authResolver = {
    signup: async (_: any, { credentials, name , bio }: SignUpArgs, { prisma }: Context): Promise<UserPayload> => {
        
        const {email , password} = credentials;
        const isEmail = validator.isEmail(email);

        if (!isEmail) {
            return {
                userErrors: [
                    {
                        message: "Invalid email",
                    },
                ],
                token: null,
            };
        }

        const isValidPassword = validator.isLength(password, {
            min: 5
        })


        if (!isValidPassword) {
            return {
                userErrors: [{
                    message: "Invalid password"
                }],
                token: null
            }
        }

        if (!name || !bio) {
            return {
                userErrors: [
                    {
                        message: "Invalid name or bio",
                    },
                ],
                token: null,
            };
        }

        const hashedPassWord = await bcypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassWord
            }
        })


        await prisma.profile.create({
            data: {
                bio,
                userId: user.id
            }
        });

        const token = await jsonwebtoken.sign(
            {
                userId: user.id,
            },
            JSON_SIGNATURE,
            { expiresIn: 3600000 }
        )

        return {
            userErrors: [],
            token: token
        };


    },
    signin: async (_: any, { credentials }: SignUpArgs, { prisma }: Context): Promise<UserPayload> => {
        
        const {email , password} = credentials;
        const isEmail = validator.isEmail(email);

        if (!isEmail) {
            return {
                userErrors: [
                    {
                        message: "Invalid email",
                    },
                ],
                token: null,
            };
        }

        let user = await prisma.user.findUnique({
            where : {
                email 
            }
        }  
        );
        
        if (!user){
            return {
                userErrors: [
                    {
                        message: "Invalid email or password ",
                    },
                ],
                token: null,
            };
        }

        const passwordMatch = await bcypt.compare(password, user.password); 
    
        if (!passwordMatch){
            return {
                userErrors: [
                    {
                        message: "Invalid email or password ",
                    },
                ],
                token: null,
            };
        }
       
        const token = await jsonwebtoken.sign(
            {
                userId: user.id,
            },
            JSON_SIGNATURE,
            { expiresIn: 3600000 }
        )

        return {
            userErrors: [],
            token: token
        };

    }
}
