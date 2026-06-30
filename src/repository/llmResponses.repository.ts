import { InsertLLMResponseToDBError } from "../exceptions/llmResponses.exceptions";
import { generateNanoId } from "../utils/nanoid.utils";
import db from "./db";
import { llmResponses } from "./schema";

export async function insertLLMResponseToDB(payload: {
	userId: string;
	organizationId: string;
	model: string;
	provider: string;
	prompt: string;
	response: object;
	inputTokens: number;
	outputTokens: number;
	cachedInputTokens: number;
	totalCost: number;
	totalTokens: number;
	currency: string;
}) {
	try {
		const insertPayload = {
			responseId: `response_${generateNanoId()}`,
			userId: payload.userId,
			organisationId: payload.organizationId,
			model: payload.model,
			provider: payload.provider,
			prompt: payload.prompt,
			response: payload.response,
			inputTokens: payload.inputTokens,
			outputTokens: payload.outputTokens,
			cachedInputTokens: payload.cachedInputTokens,
			totalCost: payload.totalCost,
			totalTokens: payload.totalTokens,
			currency: payload.currency,
			loggedAt: new Date(),
		};
		await db.insert(llmResponses).values(insertPayload);
		return insertPayload;
	} catch (error) {
		throw new InsertLLMResponseToDBError("Error occurred while inserting LLM response to database", { cause: (error as Error).message });
	}
}
