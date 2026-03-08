import { and, rule, shield } from "graphql-shield";

const isAuthenticated = rule({ cache: "contextual" })(async (
  parent,
  args,
  context,
) => {
  return context?.user !== null;
});

const isAdmin = rule({ cache: "contextual" })(async (parent, args, context) => {
  return context?.user?.role.includes("admin");
});

export const permissions = shield({
  Query: {
    currentUser: isAuthenticated,
    logout: isAuthenticated,
  },
  Mutation: {
    createNewRoom: and(isAuthenticated, isAdmin),
    updateRoom: and(isAuthenticated, isAdmin),
    deleteRoom: and(isAuthenticated, isAdmin),

    uploadAvatar: isAuthenticated,
    updateUserProfile: isAuthenticated,
    updateUserPassword: isAuthenticated,
    forgetPassword: isAuthenticated,
    resetPassword: isAuthenticated,
  },
});
