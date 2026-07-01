import { USER_ROLES } from "../constants/constants";
import { AddOrganisationToDBError, GetUserOrganisationsFromDBError } from "../exceptions/organisation.exceptions";
import { AddOrganisationMemberToDBError } from "../exceptions/organisationMembers.exceptions";
import { AddUserToDBError, GetUserByEmailFromDBError, LoginUserError } from "../exceptions/user.exceptions";
import { createOrganisatonInDB, getUserOrganisationsFromDB } from "../repository/organisation.repository";
import { addMemberToOrganisationInDB } from "../repository/organisationMembers.repository";
import { addUserToDB, getUserByEmailFromDB } from "../repository/user.repository";
import type { ILoginUserSchema } from "../routes/v1/user.route";

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
		const newOrganisationMember = await addMemberToOrganisationInDB({
			organisationId: newOrganisation.organisationId,
			userId: newUser.userId,
			role: USER_ROLES.ADMIN,
		});
		return { user: newUser, organisation: newOrganisationMember };
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
