import { createRouter } from "./helpers/createRouter";
import { usersRouter } from "./User.router";

export const appRouter = createRouter()

  .merge('user.', usersRouter)
