import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from 'cors';
import { Application, json } from "express";
import { roomResolvers } from "../graphql/resolvers/room";
import { roomTypeDefs } from "../graphql/typeDefs/room";

export const startApolloServer = async (app: Application) => {
  const typeDefs = [roomTypeDefs];
  const resolvers = [roomResolvers];

  const schema = makeExecutableSchema({
    typeDefs, resolvers
  })

  const apolloServer = new ApolloServer({ schema });

  await apolloServer.start();

  app.use("/graphql",
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
    json(),
    expressMiddleware(apolloServer))
}