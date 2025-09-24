import { Elysia } from "elysia";
import {todoRoute} from "./routes/todoRoutes";

const app = new Elysia()
  .use(todoRoute)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
