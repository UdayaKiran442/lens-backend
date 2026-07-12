import { eq } from "drizzle-orm";
import { AddUserToDBError, GetUserByEmailFromDBError, GetUserByUserIdFromDBError } from "../exceptions/user.exceptions";
import db from "./db";
import { users } from "./schema";

export async function getUserByEmailFromDB(email: string) {
	try {
		return await db.select().from(users).where(eq(users.email, email));
	} catch (error) {
		throw new GetUserByEmailFromDBError("Error while fetching user from database", { cause: (error as Error).message });
	}
}

export async function getUserByUserIdFromDB(userId: string) {
	try {
		return await db.select().from(users).where(eq(users.userId, userId));
	} catch (error) {
		throw new GetUserByUserIdFromDBError("Error while fetching user from database", { cause: (error as Error).message });
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
