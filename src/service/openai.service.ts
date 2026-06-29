import OpenAI from "openai";
import type { IChatCompletionSchema } from "../routes/v1/chat.route";
import { GenerateOpenAIResponseError } from "../exceptions/openai.exceptions";
import type { IChatCompletion } from "../types/types";

export async function generateOpenAIResponse(payload: IChatCompletionSchema): Promise<IChatCompletion> {
	try {
		const openai = new OpenAI({
			apiKey: payload.apiKey,
		});
		const response = await openai.chat.completions.create({
			model: payload.model,
			messages: [{
                "role": "user",
                "content": payload.prompt
            }],
			temperature: payload.temperature,
			top_p: payload.top_p,
		});
		return (response as unknown as IChatCompletion);
	} catch (error) {
		throw new GenerateOpenAIResponseError("Error occurred while generating OpenAI response", { cause: (error as Error).message });
	}
}
