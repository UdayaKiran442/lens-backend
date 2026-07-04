ALTER TABLE "llm_requests" ADD COLUMN "temperature" numeric(5,2) NOT NULL;--> statement-breakpoint
ALTER TABLE "llm_requests" ADD COLUMN "top_p" numeric(5,2) NOT NULL;