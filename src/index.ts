import { Hono } from "hono";
import { ActiveConfig } from "./utils/config.utils";

const app = new Hono();

app.get("/", async (c) => {
	return c.text(`Hello Hono! Running in ${ActiveConfig.ENVIRONMENT} environment`);
});

export default {
	port: 8000,
	fetch: app.fetch,
};
