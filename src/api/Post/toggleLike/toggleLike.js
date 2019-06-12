import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    toggleLike: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { postID } = args;
      const { user } = request;

      try {
        const existingLike = await prisma.$exists.like({
          AND: [
            {
              user: {
                id: user.id
              }
            },
            {
              post: {
                id: postID
              }
            }
          ]
        });

        if (existingLike) {
          // To do: delete it
        } else {
          await prisma.createLike({
            user: {
              connect: {
                id: user.id
              }
            },
            post: {
              connect: {
                id: postID
              }
            }
          });
        }

        return true;
      } catch {
        return false;
      }
    }
  }
};
