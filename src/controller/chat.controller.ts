import { MODEL_PROVIDERS } from "../constants/constants";
import { ChatCompletionsError } from "../exceptions/chat.exceptions";
import type { IChatCompletionSchema } from "../routes/v1/chat.route";

export async function chatController(payload: IChatCompletionSchema) { 
    try {
        // implement chat controler logic using switch case for different providers
        switch (payload.provider) {
            case MODEL_PROVIDERS.OPENAI:
                // implement openai chat logic here
                break;
            case MODEL_PROVIDERS.SARVAMAI:
                // implement sarvamai chat logic here
                break;
            default:
                throw new ChatCompletionsError("Invalid provider");
        }

    } catch (error) {
        throw new ChatCompletionsError("Error occurred while processing chat completion", { cause: (error as Error).message })
    }
}