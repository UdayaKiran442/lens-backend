DROP INDEX "llm_responses_user_idx";--> statement-breakpoint
DROP INDEX "llm_responses_organisation_idx";--> statement-breakpoint
CREATE INDEX "llm_responses_idx" ON "llm_responses" ("user_id","organisation_id");