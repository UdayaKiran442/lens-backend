import { Hono } from "hono";
import z from "zod";
import { fetchLLMRequest } from "../../controller/llmReqeust.controller";
import { FetchLLMRequestError, FetchLLMRequestFromDBError } from "../../exceptions/llmRequests.exceptions";
import { authMiddleware } from "../../middleware/auth.middleware";

const llmRequest = new Hono();

const FetchLLMRequestSchema = z.object({
	requestId: z.string(),
    organisationId: z.string(),
});

export type IFetchLLMRequestSchema = z.infer<typeof FetchLLMRequestSchema> & { userId: string };

llmRequest.post("/fetch", authMiddleware, async (c) => {
    try {
        const validation = FetchLLMRequestSchema.safeParse(await c.req.json());
        if (!validation.success) {
            throw validation.error;
        }
        const payload = {
            ...validation.data,
            userId: c.get("user").userId as string,
        }
        const request = await fetchLLMRequest(payload);
        return c.json({ success: true, request }, 200);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errMessage = JSON.parse(error.message);
            return c.json({ success: false, error: errMessage[0], message: errMessage[0].message }, 401);
        }
        if (error instanceof FetchLLMRequestError || error instanceof FetchLLMRequestFromDBError) {
            return c.json({ success: false, error: error.message, message: error.cause }, 401);
        }
        return c.json({ success: false, error: "Error occurred while fetching LLM request", message: (error as Error).message }, 500);
    }
})

export default llmRequest;
