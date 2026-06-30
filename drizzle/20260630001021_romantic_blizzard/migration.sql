CREATE TABLE "model_pricing" (
	"provider" varchar,
	"model" varchar,
	"input_price" varchar NOT NULL,
	"output_price" varchar NOT NULL,
	"cached_input_price" varchar NOT NULL,
	"unit" varchar NOT NULL,
	CONSTRAINT "model_pricing_pk" PRIMARY KEY("provider","model")
);
