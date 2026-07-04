import { Hono } from "hono";
import userRouter from "./user.route";
import chatRouter from "./chat.route";
import llmRequest from "./llmRequest.route";

const v1Router = new Hono();

v1Router.route("/user", userRouter);
v1Router.route("/chat", chatRouter);
v1Router.route("/llm-request", llmRequest);

export default v1Router;