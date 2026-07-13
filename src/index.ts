import { Hono } from "hono";
import { countOrgLast7DaysLLMRequestsFromDB } from "./repository/llmRequests.repository";
import v1Router from "./routes/v1";
import { hashApiKey } from "./utils/bycrypt.utils";
import { ActiveConfig } from "./utils/config.utils";
import { generateNanoId } from "./utils/nanoid.utils";

const app = new Hono();

app.get("/", async (c) => {
	return c.text(`Hello Hono! Running in ${ActiveConfig.ENVIRONMENT} environment`);
});

app.get("/test1", async (c) => {
	const count = await countOrgLast7DaysLLMRequestsFromDB("org_iRf7pybBZyKxfruNh4G03");
	return c.json({ count });
});

app.get("/test2", async (c) => {
	const lensApiKey = `lens_api_${generateNanoId()}`;
	const hashedApiKey = await hashApiKey(lensApiKey);
	return c.json({ lensApiKey, hashedApiKey });
});

app.route("/v1", v1Router);

export default {
	port: 8000,
	fetch: app.fetch,
};
