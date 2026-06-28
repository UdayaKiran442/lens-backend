import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

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
