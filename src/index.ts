import { Hono } from "hono";
import { ActiveConfig } from "./utils/config.utils";
import v1Router from "./routes/v1";

const app = new Hono();

app.get("/", async (c) => {
	return c.text(`Hello Hono! Running in ${ActiveConfig.ENVIRONMENT} environment`);
});

app.route("/v1", v1Router);

export default {
	port: 8000,
	fetch: app.fetch,
};
