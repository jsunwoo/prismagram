import { prisma } from "../../../../generated/prisma-client";
// import { USER_FRAGMENT } from "../../../fragments";

export default {
  Query: {
    me: async (_, __, { request, isAuthenticated }) => {
      // isAuthenticated(request);
      const user = request.user;
      console.log(user.id);
      console.log(await prisma.user({ id: user.id }).followers());
      // return prisma.user({ id: user.id }).$fragment(USER_FRAGMENT);
      const userProfile = await prisma.user({ id: user.id });
      const posts = await prisma.user({ id: user.id }).posts();

      return {
        user: userProfile,
        posts
      };
    }
  }
};
