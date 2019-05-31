import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    allUsers: async (_, args, { request }) => {
      console.log(request.user);
      return await prisma.users();
    }
  }
};
