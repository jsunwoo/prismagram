export const isAuthenticated = request => {
  console.log(request.user);
  if (!request.user) {
    throw Error("You need to log in to perform this action");
  }
  return;
};
