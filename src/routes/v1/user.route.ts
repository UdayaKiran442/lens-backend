import { Hono } from "hono";
import z from "zod";
import { AddUserToDBError, GetUserByEmailFromDBError, LoginUserError } from "../../exceptions/user.exceptions";
import { AddOrganisationToDBError } from "../../exceptions/organisation.exceptions";
import { AddOrganisationMemberToDBError } from "../../exceptions/organisationMembers.exceptions";
import { loginUser } from "../../controller/user.controller";

const userRouter = new Hono();

const LoginUserSchema = z.object({
	email: z.string(),
	userId: z.string(),
});

export type ILoginUserSchema = z.infer<typeof LoginUserSchema>;

userRouter.post("/login", async (c) => {
	try {
		const validation = LoginUserSchema.safeParse(await c.req.json());
		if (!validation.success) {
			throw validation.error;
		}
		const payload = validation.data;
		const data = await loginUser(payload);
		return c.json({ success: true, data }, 200);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errMessage = JSON.parse(error.message);
			return c.json({ success: false, error: errMessage[0], message: errMessage[0].message }, 401);
		}
		if (
			error instanceof AddUserToDBError ||
			error instanceof GetUserByEmailFromDBError ||
			error instanceof AddOrganisationToDBError ||
			error instanceof AddOrganisationMemberToDBError ||
			error instanceof LoginUserError
		) {
			return c.json({ success: false, error: error.message }, 401);
		}
		return c.json({ success: false, error: "Error occurred while logging in user", message: (error as Error).message }, 500);
	}
});

export default userRouter;
