import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";
import { Application, json, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { roomResolvers } from "../graphql/resolvers/room";
import { userResolvers } from "../graphql/resolvers/user";
import { roomTypeDefs } from "../graphql/typeDefs/room";
import { userTypeDefs } from "../graphql/typeDefs/user";
import { User } from "../models/user";

export const startApolloServer = async (app: Application) => {
  const typeDefs = [roomTypeDefs, userTypeDefs];
  const resolvers = [roomResolvers, userResolvers];

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // const schemaWithPermissions = applyMiddleware(schema, permissions)

  const apolloServer = new ApolloServer({ schema });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }: { req: Request; res: Response }) => {
        let user = null;
        const token = req.cookies?.token;

        if (token) {
          try {
            const decodedToken = jwt.verify(
              token,
              process.env.JWT_SECRET!
            ) as JwtPayload;
            user = await User.findById(decodedToken._id);
            console.log("Authenticated user:", user?.email || "not found");
            if (!user) {
              throw new Error("User not found.");
            }
          } catch (error) {
            throw new Error("Invaild token or expired token.");
          }
        }
        return { req, res, user };
      },
    })
  );
};
