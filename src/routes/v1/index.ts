import { Hono } from "hono";
import userRouter from "./user.route";

const v1Router = new Hono();

v1Router.route("/user", userRouter);

export default v1Router;