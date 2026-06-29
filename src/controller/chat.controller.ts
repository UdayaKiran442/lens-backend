import { MODEL_PROVIDERS } from "../constants/constants";
import { ChatCompletionsError } from "../exceptions/chat.exceptions";
import { GenerateOpenAIResponseError } from "../exceptions/openai.exceptions";
import { GenerateSarvamResponseError } from "../exceptions/sarvam.exceptions";
import type { IChatCompletionSchema } from "../routes/v1/chat.route";
import { generateOpenAIResponse } from "../service/openai.service";
import { generateSarvamResponse } from "../service/sarvamai.service";
import type { IChatCompletion } from "../types/types";

export async function chatController(payload: IChatCompletionSchema) {
	try {
        let response: IChatCompletion;
		// implement chat controler logic using switch case for different providers
		switch (payload.provider) {
			case MODEL_PROVIDERS.OPENAI: {
				response = await generateOpenAIResponse(payload);
				break;
			}
			case MODEL_PROVIDERS.SARVAMAI: {
				response = await generateSarvamResponse(payload);
                break;
			}
			default:
				throw new ChatCompletionsError("Invalid provider");
		}
        return response;
	} catch (error) {
		if (error instanceof GenerateSarvamResponseError || error instanceof GenerateOpenAIResponseError) {
			throw error;
		}
		throw new ChatCompletionsError("Error occurred while processing chat completion", { cause: (error as Error).message });
	}
}
