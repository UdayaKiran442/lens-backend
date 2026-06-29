import type { Context } from "hono";
import { jwtDecode } from "jwt-decode";

export interface AuthUser {
	userId: string;
}

declare module "hono" {
	interface ContextVariableMap {
		user: AuthUser;
	}
}

export async function authMiddleware(c: Context, next: () => Promise<void>) {
	const authHeader = c.req.header("Authorization");
	if (!authHeader) {
		return c.json({ success: false, error: "Authorization header missing" }, 401);
	}
	const decodedToken = jwtDecode(authHeader);
	const userId = decodedToken.sub;
	if (!userId) {
		return c.json({ success: false, error: "Authorization header missing" }, 401);
	}
	c.set("user", { userId });
	await next();
}
