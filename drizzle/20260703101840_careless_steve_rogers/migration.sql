ALTER TABLE "llm_responses" RENAME TO "llm_requests";--> statement-breakpoint
ALTER TABLE "llm_requests" RENAME COLUMN "response_id" TO "request_id";--> statement-breakpoint
ALTER INDEX "llm_responses_idx" RENAME TO "llm_requests_idx";--> statement-breakpoint
ALTER TABLE "llm_requests" RENAME CONSTRAINT "llm_responses_pk" TO "llm_requests_pk";