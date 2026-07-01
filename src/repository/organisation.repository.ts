import { and, eq } from "drizzle-orm";
import { AddOrganisationToDBError, GetUserOrganisationsFromDBError } from "../exceptions/organisation.exceptions";
import { generateNanoId } from "../utils/nanoid.utils";
import db from "./db";
import { organisationMembers, organisations } from "./schema";

export async function createOrganisatonInDB(payload: { name: string }) {
	try {
		const insertPayload = {
			organisationId: `org_${generateNanoId()}`,
			name: payload.name,
			createdAt: new Date(),
		};
		await db.insert(organisations).values(insertPayload);
		return insertPayload;
	} catch (error) {
		throw new AddOrganisationToDBError("Error occurred while creating organisation", { cause: (error as Error).message });
	}
}

export async function getUserOrganisationsFromDB(userId: string) {
	try {
		const organisations = await db.select().from(organisationMembers).where(and(eq(organisationMembers.userId, userId)));
		return organisations[0];
	} catch (error) {
		throw new GetUserOrganisationsFromDBError("Error occurred while fetching user organisations", { cause: (error as Error).message });
	}
}