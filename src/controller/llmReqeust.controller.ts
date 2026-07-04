import { FetchLLMRequestError, FetchLLMRequestFromDBError } from "../exceptions/llmRequests.exceptions";
import { fetchLLMRequestFromDB } from "../repository/llmRequests.repository";
import type { IFetchLLMRequestSchema } from "../routes/v1/llmRequest.route";

export async function fetchLLMRequest(payload: IFetchLLMRequestSchema) {
	try {
		const llmRequest = await fetchLLMRequestFromDB(payload.requestId);
		if (payload.userId !== llmRequest.userId || payload.organisationId !== llmRequest.organisationId) {
			throw new FetchLLMRequestError("User is not authorized to fetch this LLM request", { cause: "Unauthorized access" });
		}
		return llmRequest;
	} catch (error) {
		if (error instanceof FetchLLMRequestFromDBError || error instanceof FetchLLMRequestError) {
			throw error;
		}
		throw new FetchLLMRequestError("Error occurred while fetching LLM request", { cause: (error as Error).message });
	}
}
