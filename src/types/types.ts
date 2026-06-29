export type IChatCompletion = {
	id: string;
	choices: [
		{
			finish_reason: string;
			index: number;
			logprobs: null;
			message: {
				content: string;
				refusal: null;
				reasoning_content: string | null;
				role: string;
				tool_calls: null;
			};
		},
	];
	created: number;
	model: string;
	object: string;
	service_tier: string | null;
	system_fingerprint: string | null;
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
		prompt_tokens_details: {
			cached_tokens: number;
			audio_tokens: number;
		} | null;
		completion_tokens_details: {
			reasoning_tokens: number;
			audio_tokens: number;
			accepted_prediction_tokens: number;
			rejected_prediction_tokens: number;
		} | null;
	};
};
