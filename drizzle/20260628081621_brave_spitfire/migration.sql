CREATE TABLE "organisation_members" (
	"member_id" varchar PRIMARY KEY,
	"organisation_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"role" varchar NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organisations" (
	"organisation_id" varchar PRIMARY KEY,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" varchar PRIMARY KEY,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"is_organisation" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
