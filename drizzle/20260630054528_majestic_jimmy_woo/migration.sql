CREATE TABLE "llm_responses" (
	"response_id" varchar,
	"user_id" varchar NOT NULL,
	"organisation_id" varchar NOT NULL,
	"provider" varchar NOT NULL,
	"model" varchar NOT NULL,
	"prompt" varchar NOT NULL,
	"response" json NOT NULL,
	"input_tokens" integer NOT NULL,
	"output_tokens" integer NOT NULL,
	"cached_input_tokens" integer NOT NULL,
	"total_cost" numeric(15,7) NOT NULL,
	"total_tokens" integer NOT NULL,
	"currency" varchar NOT NULL,
	"logged_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "llm_responses_pk" PRIMARY KEY("response_id")
);
--> statement-breakpoint
CREATE INDEX "llm_responses_user_idx" ON "llm_responses" ("user_id");--> statement-breakpoint
CREATE INDEX "llm_responses_organisation_idx" ON "llm_responses" ("organisation_id");