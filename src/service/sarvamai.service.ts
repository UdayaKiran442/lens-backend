import { SarvamAIClient } from "sarvamai";
import { GenerateSarvamResponseError } from "../exceptions/sarvam.exceptions";
import type { IChatCompletionSchema } from "../routes/v1/chat.route";
import type { IChatCompletion } from "../types/types";


export async function generateSarvamResponse(payload: IChatCompletionSchema): Promise<IChatCompletion> {
	const client = new SarvamAIClient({
		apiSubscriptionKey: payload.apiKey,
	});
	try {
		const response = await client.chat.completions({
			// biome-ignore lint/suspicious/noExplicitAny: <need to find the exact import for the type>
			messages: (payload.prompt as any),
			// biome-ignore lint/suspicious/noExplicitAny: <parameter model has different type other than string for sarvam>
			model: payload.model as any,
			temperature: 0.7,
			top_p: payload.top_p,
		});
		return (response as unknown as IChatCompletion);
	} catch (error) {
		throw new GenerateSarvamResponseError("Failed to generate response from Sarvam", { cause: (error as Error).message });
	}
}
