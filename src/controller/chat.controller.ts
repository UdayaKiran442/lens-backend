import { MODEL_PROVIDERS } from "../constants/constants";
import { ChatCompletionsError } from "../exceptions/chat.exceptions";
import { GetModelPricingFromDBError } from "../exceptions/modelPricing.exceptions";
import { GenerateOpenAIResponseError } from "../exceptions/openai.exceptions";
import { GenerateSarvamResponseError } from "../exceptions/sarvam.exceptions";
import { getModelPricingFromDB } from "../repository/modelPricing.repository";
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
		const pricing = await getModelPricingFromDB({ provider: payload.provider, model: payload.model });
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
				totalCost = (inputTokens * inputPricing) / unitPrice + (outputTokens * outputPricing) / unitPrice + (cachedInputTokens * cachedPricing) / unitPrice;
				break;
			}
			case MODEL_PROVIDERS.SARVAMAI: {
				response = await generateSarvamResponse(payload);
				cachedInputTokens = response.usage.prompt_tokens_details?.cached_tokens || 0;
				inputTokens = response.usage.prompt_tokens - cachedInputTokens;
				outputTokens = response.usage.completion_tokens;
				totalCost = (inputTokens * inputPricing) / unitPrice + (outputTokens * outputPricing) / unitPrice + (cachedInputTokens * cachedPricing) / unitPrice;
				break;
			}
			default:
				throw new ChatCompletionsError("Invalid provider");
		}
		return { response, inputTokens, outputTokens, cachedInputTokens, totalCost, currency };
	} catch (error) {
		if (error instanceof GenerateSarvamResponseError || error instanceof GenerateOpenAIResponseError || error instanceof GetModelPricingFromDBError) {
			throw error;
		}
		throw new ChatCompletionsError("Error occurred while processing chat completion", { cause: (error as Error).message });
	}
}
