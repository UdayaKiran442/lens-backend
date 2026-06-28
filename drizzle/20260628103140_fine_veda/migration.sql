ALTER TABLE "users" DROP COLUMN "is_organisation";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;