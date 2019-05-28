import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    allUsers: async (_, args, { request }) => {
      // console.log(request);
      return await prisma.users();
    }
  }
};
