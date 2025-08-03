import { register } from "../../controllers/user";
import { UserInput } from "../../types/user";

export const userResolvers = {
  Query: {},
  Mutation: {
    register: async (_: any, { userInput }: {
      userInput: UserInput
    }) =>
      register(userInput),
  },
};