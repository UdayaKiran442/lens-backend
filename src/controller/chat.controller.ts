import redis from "../config/redis.config";
import { MODEL_PROVIDERS, PAYMENT_PLANS } from "../constants/constants";
import { ChatCompletionsError } from "../exceptions/chat.exceptions";
import { CountOrgLast7DaysLLMRequestsFromDBError, InsertLLMRequestsToDBError } from "../exceptions/llmRequests.exceptions";
import { GetModelPricingFromDBError } from "../exceptions/modelPricing.exceptions";
import { GenerateOpenAIResponseError } from "../exceptions/openai.exceptions";
import { GenerateSarvamResponseError } from "../exceptions/sarvam.exceptions";
import { countOrgLast7DaysLLMRequestsFromDB, insertLLMRequestsToDB } from "../repository/llmRequests.repository";
import { getModelPricingFromDB } from "../repository/modelPricing.repository";
import { getUserByUserIdFromDB } from "../repository/user.repository";
import type { IChatCompletionSchema } from "../routes/v1/chat.route";
import { generateOpenAIResponse } from "../service/openai.service";
import { generateSarvamResponse } from "../service/sarvamai.service";
import type { IChatCompletion } from "../types/types";

export async function chatController(payload: IChatCompletionSchema) {
	try {
		let response: IChatCompletion;
		let inputTokens = 0;
		let outputTokens = 0;
		let cachedInputTokens = 0;
		let totalCost = 0;
		let totalTokens = 0;
		const [pricing, user] = await Promise.all([
			getModelPricingFromDB({ provider: payload.provider, model: payload.model }),
			getUserByUserIdFromDB(payload.userId),
		]) 
		const inputPricing = pricing.inputPrice;
		const outputPricing = pricing.outputPrice;
		const cachedPricing = pricing.cachedInputPrice;
		const unitPrice = pricing.unit;
		const currency = pricing.currency;

		// implement chat controler logic using switch case for different providers
		switch (payload.provider) {
			case MODEL_PROVIDERS.OPENAI: {
				response = await generateOpenAIResponse(payload);
				cachedInputTokens = response.usage.prompt_tokens_details?.cached_tokens || 0;
				inputTokens = response.usage.prompt_tokens - cachedInputTokens;
				outputTokens = response.usage.completion_tokens;
				totalTokens = response.usage.total_tokens;
				totalCost = (inputTokens * inputPricing) / unitPrice + (outputTokens * outputPricing) / unitPrice + (cachedInputTokens * cachedPricing) / unitPrice;
				break;
			}
			case MODEL_PROVIDERS.SARVAMAI: {
				response = await generateSarvamResponse(payload);
				cachedInputTokens = response.usage.prompt_tokens_details?.cached_tokens || 0;
				inputTokens = response.usage.prompt_tokens - cachedInputTokens;
				outputTokens = response.usage.completion_tokens;
				totalTokens = response.usage.total_tokens;
				totalCost = (inputTokens * inputPricing) / unitPrice + (outputTokens * outputPricing) / unitPrice + (cachedInputTokens * cachedPricing) / unitPrice;
				break;
			}
			default:
				throw new ChatCompletionsError("Invalid provider");
		}
		// check user plan
		if (user[0].plan === PAYMENT_PLANS.BASIC.plan_name) {
			// check total logs for the user in the last 7 days
			const totalLogs = await countOrgLast7DaysLLMRequestsFromDB(payload.organisationId);
			// if total logs are greater than current plan, return the response without inserting the request to the database
			if (totalLogs && totalLogs >= PAYMENT_PLANS.BASIC.logs){
				return { response, inputTokens, outputTokens, cachedInputTokens, totalCost, currency, llmRequest: null };
			}
		}
		const llmRequest = await insertLLMRequestsToDB({
			organizationId: payload.organisationId,
			userId: payload.userId,
			model: payload.model,
			provider: payload.provider,
			prompt: JSON.stringify(payload.prompt),
			response: response,
			inputTokens: inputTokens,
			outputTokens: outputTokens,
			cachedInputTokens: cachedInputTokens,
			totalCost: totalCost,
			totalTokens: totalTokens,
			currency: currency,
			topP: payload.top_p,
			temprature: payload.temperature,
		});
		await redis.del(`user_llm_requests_${payload.userId}_${payload.organisationId}`);
		return { response, inputTokens, outputTokens, cachedInputTokens, totalCost, currency, llmRequest };
	} catch (error) {
		if (error instanceof GenerateSarvamResponseError || error instanceof GenerateOpenAIResponseError || error instanceof GetModelPricingFromDBError || error instanceof InsertLLMRequestsToDBError || error instanceof CountOrgLast7DaysLLMRequestsFromDBError) {
			throw error;
		}
		throw new ChatCompletionsError("Error occurred while processing chat completion", { cause: (error as Error).message });
	}
}
