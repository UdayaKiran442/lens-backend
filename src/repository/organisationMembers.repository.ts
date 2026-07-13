import { AddOrganisationMemberToDBError } from "../exceptions/organisationMembers.exceptions";
import { generateNanoId } from "../utils/nanoid.utils";
import db from "./db";
import { organisationMembers } from "./schema";

export async function addMemberToOrganisationInDB(payload: { organisationId: string; userId: string; role: string; hashedLensApiKey: string }) {
	try {
		const insertPayload = {
			memberId: `member_${generateNanoId()}`,
			organisationId: payload.organisationId,
			lensApiKey: payload.hashedLensApiKey,
			keyName: "default",
			userId: payload.userId,
			role: payload.role,
		};
		await db.insert(organisationMembers).values(insertPayload);
		return insertPayload;
	} catch (error) {
		throw new AddOrganisationMemberToDBError("Error occurred while adding member to organisation", { cause: (error as Error).message });
	}
}
