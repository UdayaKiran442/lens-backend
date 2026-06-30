import { Hono } from "hono";
import z from "zod";
import { MODEL_PROVIDERS } from "../../constants/constants";
import { chatController } from "../../controller/chat.controller";
import { ChatCompletionsError } from "../../exceptions/chat.exceptions";
import { InsertLLMResponseToDBError } from "../../exceptions/llmResponses.exceptions";
import { GetModelPricingFromDBError } from "../../exceptions/modelPricing.exceptions";
import { GenerateOpenAIResponseError } from "../../exceptions/openai.exceptions";
import { GenerateSarvamResponseError } from "../../exceptions/sarvam.exceptions";
import { authMiddleware } from "../../middleware/auth.middleware";

const chatRouter = new Hono();

const ChatCompletionSchema = z.object({
	model: z.string(),
	provider: z.enum([MODEL_PROVIDERS.OPENAI, MODEL_PROVIDERS.SARVAMAI]),
	prompt: z.array(
		z.object({
			role: z.string(),
			content: z.string(),
		}),
	),
	apiKey: z.string(),
	temperature: z.number(),
	top_p: z.number(),
	organisationId: z.string(),
});

export type IChatCompletionSchema = z.infer<typeof ChatCompletionSchema> & { userId: string };

chatRouter.post("/completion", authMiddleware, async (c) => {
	try {
		const validation = ChatCompletionSchema.safeParse(await c.req.json());
		if (!validation.success) {
			throw validation.error;
		}
		const userId = c.get("user").userId;
		const payload = {
			...validation.data,
			userId,
		};
		const response = await chatController(payload);
		return c.json({ success: true, response }, 200);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errMessage = JSON.parse(error.message);
			return c.json({ success: false, error: errMessage[0], message: errMessage[0].message }, 400);
		}
		if (
			error instanceof ChatCompletionsError ||
			error instanceof GetModelPricingFromDBError ||
			error instanceof GenerateSarvamResponseError ||
			error instanceof GenerateOpenAIResponseError ||
			error instanceof InsertLLMResponseToDBError
		) {
			return c.json({ success: false, error: error.message, message: error.message }, 500);
		}
		return c.json({ success: false, error: "Error occurred while processing chat completion", message: (error as Error).message }, 500);
	}
});

export default chatRouter;
