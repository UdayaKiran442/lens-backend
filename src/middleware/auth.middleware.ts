import type { Context } from "hono";
import { jwtDecode } from "jwt-decode";
import { UnauthorizedError } from "../exceptions/common.exceptions";

export interface AuthUser {
	userId: string;
}

declare module "hono" {
	interface ContextVariableMap {
		user: AuthUser;
	}
}

export async function authMiddleware(c: Context, next: () => Promise<void>) {
	try {
		const authHeader = c.req.header("Authorization");
		if (!authHeader) {
			throw new UnauthorizedError("Authorization header is missing");
		}
		const decodedToken = jwtDecode(authHeader);
		const userId = decodedToken.sub;
		if (!userId) {
			throw new UnauthorizedError("Invalid token or expired token");
		}
		c.set("user", { userId });
		await next();
	} catch (error) {
		if (error instanceof UnauthorizedError) {
			throw error;
		}
		throw new UnauthorizedError("Error occurred while authenticating user", { cause: (error as Error).message });
	}
}
