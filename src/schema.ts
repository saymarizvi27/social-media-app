import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    hello:String!
    posts: [Post!]!
    me: User
    profile(userId: ID!): Profile
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String! 
    published: Boolean!
    user: User!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    createAt: String!
    posts: [Post!]!   
  }

  type Profile {
    id: ID!
    bio: String!
    user: User! 
  }

  type Mutation {
    postCreate(post : PostInput!): PostPayload!
    postUpdate(postId: ID!, post : PostInput!): PostPayload!
    postDelete(postId:ID!): PostPayload!
    signup(
      credentials: CredentialsInput!,
      name:String!,
      bio:String!,
    ): AuthPayload 
    signin(credentials: CredentialsInput!) :  AuthPayload
    postPublish(postid:ID!): PostPayload!
    postUnpublish(postid: ID!): PostPayload!
  }

  type UserError{
    message: String!
  }

  type PostPayload {
    userErrors: [UserError!]!
    post: Post
  }

  type AuthPayload {
    userErrors: [UserError!]!
    token: String
  }

  input PostInput{
    title: String,
    content: String 
  }

  input CredentialsInput {
    email : String!
    password: String! 
  }



`
