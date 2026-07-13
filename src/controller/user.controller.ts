import redis from "../config/redis.config";
import { USER_ROLES } from "../constants/constants";
import { GetUserLLMRequestsFromDBError } from "../exceptions/llmRequests.exceptions";
import { AddOrganisationToDBError, GetUserOrganisationsFromDBError } from "../exceptions/organisation.exceptions";
import { AddOrganisationMemberToDBError } from "../exceptions/organisationMembers.exceptions";
import { AddUserToDBError, GetUserByEmailFromDBError, GetUserLLMRequestsError, LoginUserError } from "../exceptions/user.exceptions";
import { getUserLLMRequestsFromDB } from "../repository/llmRequests.repository";
import { createOrganisatonInDB, getUserOrganisationsFromDB } from "../repository/organisation.repository";
import { addMemberToOrganisationInDB } from "../repository/organisationMembers.repository";
import { addUserToDB, getUserByEmailFromDB } from "../repository/user.repository";
import type { ILoginUserSchema, IUserLLMRequestsSchema } from "../routes/v1/user.route";
import { hashApiKey } from "../utils/bycrypt.utils";
import { generateNanoId } from "../utils/nanoid.utils";

export async function loginUser(payload: ILoginUserSchema) {
	try {
		// check if user exists in the database
		const user = await getUserByEmailFromDB(payload.email);
		// if user exists, return success response
		if (user.length > 0) {
			const userOrganisation = await getUserOrganisationsFromDB(user[0].userId);
			return { user: user[0], organisation: userOrganisation };
		}
		// else, add user to the database along with create new organisation and add user to organisation members table
		const [newUser, newOrganisation] = await Promise.all([addUserToDB({ userId: payload.userId, email: payload.email, name: null }), createOrganisatonInDB({ name: "New Organisation" })]);
		const lensApiKey = `lens_api_${generateNanoId()}`;
		const hashedApiKey = await hashApiKey(lensApiKey);
		const newOrganisationMember = await addMemberToOrganisationInDB({
			organisationId: newOrganisation.organisationId,
			userId: newUser.userId,
			role: USER_ROLES.ADMIN,
			hashedLensApiKey: hashedApiKey,
		});
		return { user: newUser, organisation: newOrganisationMember, lensApiKey };
	} catch (error) {
		if (
			error instanceof AddUserToDBError ||
			error instanceof GetUserByEmailFromDBError ||
			error instanceof AddOrganisationToDBError ||
			error instanceof AddOrganisationMemberToDBError ||
			error instanceof GetUserOrganisationsFromDBError
		) {
			throw error;
		}
		throw new LoginUserError("Error occurred while logging in user", { cause: (error as Error).message });
	}
}

export async function getUserLLMRequests(payload: IUserLLMRequestsSchema) {
	try {
		// biome-ignore lint/suspicious/noExplicitAny: <due to dynamic type of cached responses>
		const cachedResponses = await redis.get(`user_llm_requests_${payload.userId}_${payload.organisationId}`) as any;
		if (cachedResponses) {
			return cachedResponses;
		}
		const userLLMRequests = await getUserLLMRequestsFromDB({ userId: payload.userId, organizationId: payload.organisationId });
		await redis.set(`user_llm_requests_${payload.userId}_${payload.organisationId}`, JSON.stringify(userLLMRequests), { ex: 3600 });
		return userLLMRequests;
	} catch (error) {
		if (error instanceof GetUserLLMRequestsFromDBError) {
			throw error;
		}
		throw new GetUserLLMRequestsError("Error occurred while fetching user LLM responses", { cause: (error as Error).message });
	}
}
