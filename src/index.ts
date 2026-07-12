import { Hono } from "hono";
import { countOrgLast7DaysLLMRequestsFromDB } from "./repository/llmRequests.repository";
import v1Router from "./routes/v1";
import { ActiveConfig } from "./utils/config.utils";

const app = new Hono();

app.get("/", async (c) => {
	return c.text(`Hello Hono! Running in ${ActiveConfig.ENVIRONMENT} environment`);
});

app.get("/test1", async (c) => {
	const count = await countOrgLast7DaysLLMRequestsFromDB("org_iRf7pybBZyKxfruNh4G03");
	return c.json({ count });
});

app.route("/v1", v1Router);

export default {
	port: 8000,
	fetch: app.fetch,
};
