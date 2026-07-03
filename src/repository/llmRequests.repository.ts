import { and, eq } from "drizzle-orm";
import { GetUserLLMRequestsFromDBError, InsertLLMRequestsToDBError } from "../exceptions/llmRequests.exceptions";
import { generateNanoId } from "../utils/nanoid.utils";
import db from "./db";
import { llmRequests } from "./schema";

export async function insertLLMRequestsToDB(payload: {
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
			requestId: `request_${generateNanoId()}`,
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
		await db.insert(llmRequests).values(insertPayload);
		return insertPayload;
	} catch (error) {
		throw new InsertLLMRequestsToDBError("Error occurred while inserting LLM request to database", { cause: (error as Error).message });
	}
}

export async function getUserLLMRequestsFromDB(payload: { userId: string; organizationId: string }) {
	try {
		return await db
			.select()
			.from(llmRequests)
			.where(and(eq(llmRequests.userId, payload.userId), eq(llmRequests.organisationId, payload.organizationId)));
	} catch (error) {
		throw new GetUserLLMRequestsFromDBError("Error occurred while fetching user LLM requests from database", { cause: (error as Error).message });
	}
}
