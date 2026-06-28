import { eq } from "drizzle-orm";
import db from "./db";
import { users } from "./schema";
import { AddUserToDBError, GetUserByEmailFromDBError } from "../exceptions/user.exceptions";

export async function getUserByEmailFromDB(email: string) {
	try {
		return await db.select().from(users).where(eq(users.email, email));
	} catch (error) {
		throw new GetUserByEmailFromDBError("Error while fetching user from database", { cause: (error as Error).message });
	}
}

export async function addUserToDB(payload: { userId: string; email: string; name: string | null }) {
	try {
		const insertPayload = {
			userId: payload.userId,
			email: payload.email,
            name: payload.name,
			createdAt: new Date(),
		};
		await db.insert(users).values(insertPayload);
		return insertPayload;
	} catch (error) {
		throw new AddUserToDBError("Error while adding user to database", { cause: (error as Error).message });
	}
}
