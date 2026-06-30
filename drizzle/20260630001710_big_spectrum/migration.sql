ALTER TABLE "model_pricing" ADD COLUMN "currency" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "model_pricing" ALTER COLUMN "input_price" SET DATA TYPE numeric(10,4) USING "input_price"::numeric(10,4);--> statement-breakpoint
ALTER TABLE "model_pricing" ALTER COLUMN "output_price" SET DATA TYPE numeric(10,4) USING "output_price"::numeric(10,4);--> statement-breakpoint
ALTER TABLE "model_pricing" ALTER COLUMN "cached_input_price" SET DATA TYPE numeric(10,4) USING "cached_input_price"::numeric(10,4);--> statement-breakpoint
ALTER TABLE "model_pricing" ALTER COLUMN "unit" SET DATA TYPE integer USING "unit"::integer;