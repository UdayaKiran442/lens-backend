import { compare, hash } from "bcrypt-ts";

export async function hashApiKey(apiKey: string): Promise<string> {
	const saltRounds = 10;
	return await hash(apiKey, saltRounds);
}

export async function compareApiKey(payload: { apiKey: string; hashedApiKey: string }) {
	return await compare(payload.apiKey, payload.hashedApiKey);
}