import { decimal, integer, pgTable, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	userId: varchar("user_id").primaryKey().notNull(),
	name: varchar("name"),
	email: varchar("email").notNull().unique(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const organisations = pgTable("organisations", {
	organisationId: varchar("organisation_id").primaryKey().notNull(),
	name: varchar("name").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const organisationMembers = pgTable("organisation_members", {
	memberId: varchar("member_id").primaryKey().notNull(),
	organisationId: varchar("organisation_id").notNull(),
	userId: varchar("user_id").notNull(),
	role: varchar("role").notNull(),
	joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const modelPricing = pgTable(
	"model_pricing",
	{
		provider: varchar("provider").notNull(),
		model: varchar("model").notNull(),
		inputPrice: decimal("input_price", { precision: 10, scale: 4 }).$type<number>().notNull(),
		outputPrice: decimal("output_price", { precision: 10, scale: 4 }).$type<number>().notNull(),
		cachedInputPrice: decimal("cached_input_price", { precision: 10, scale: 4 }).$type<number>().notNull(),
		currency: varchar("currency").notNull(),
		unit: integer("unit").notNull(),
	},
	(table) => ({
		primaryKey: primaryKey({ name: "model_pricing_pk", columns: [table.provider, table.model] }),
	}),
);
