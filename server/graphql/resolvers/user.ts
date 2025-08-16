import { Response } from "express";
import { login, register } from "../../controllers/user";
import { UserInput } from "../../types/user";

export const userResolvers = {
  Query: {
    currentUser: async (_: any, __: any, { user }: { user: any }) => {
      return user;
    },
  },
  Mutation: {
    register: async (
      _: any,
      {
        userInput,
      }: {
        userInput: UserInput;
      }
    ) => register(userInput),
    login: async (
      _: any,
      { email, password }: { email: string; password: string },
      { res }: { res: Response }
    ) => login(email, password, res),
  },
};
