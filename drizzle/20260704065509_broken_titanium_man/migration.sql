ALTER TABLE "llm_requests" ALTER COLUMN "temperature" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "llm_requests" ALTER COLUMN "top_p" DROP NOT NULL;