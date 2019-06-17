import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    toggleLike: async (_, args, { request, isAuthenticated }) => {
      // console.log("Args: ", args);
      isAuthenticated(request);
      const { postID } = args;
      const { user } = request;
      // console.log(postID, user);
      const filterOptions = {
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
      };

      try {
        const existingLike = await prisma.$exists.like(filterOptions);
        // console.log(existingLike);

        if (existingLike) {
          await prisma.deleteManyLikes(filterOptions);
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
      } catch (e) {
        console.log(e);
        return false;
      }
    }
  }
};
