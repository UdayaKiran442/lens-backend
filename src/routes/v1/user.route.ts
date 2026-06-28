import { Hono } from "hono";
import z from "zod";

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
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errMessage = JSON.parse(error.message);
			return c.json({ success: false, error: errMessage[0], message: errMessage[0].message }, 401);
		}
	}
});

export default userRouter;
