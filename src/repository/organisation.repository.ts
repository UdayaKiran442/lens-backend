import { AddOrganisationToDBError } from "../exceptions/organisation.exceptions";
import { generateNanoId } from "../utils/nanoid.utils";
import db from "./db";
import { organisations } from "./schema";

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
