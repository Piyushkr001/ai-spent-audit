import { pgTable, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const audits = pgTable("audits", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  publicId: text("public_id").notNull().unique(),
  teamSize: integer("team_size").notNull(),
  primaryUseCase: text("primary_use_case").notNull(),
  totalMonthlySpend: integer("total_monthly_spend").notNull(),
  totalMonthlySavings: integer("total_monthly_savings").notNull(),
  totalAnnualSavings: integer("total_annual_savings").notNull(),
  efficiencyScore: integer("efficiency_score").notNull(),
  summary: text("summary").notNull(),
  publicPayload: jsonb("public_payload").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  auditId: text("audit_id").references(() => audits.id).notNull(),
  email: text("email").notNull(),
  companyName: text("company_name"),
  role: text("role"),
  teamSize: integer("team_size"),
  monthlySavings: integer("monthly_savings").notNull(),
  isHighSavings: boolean("is_high_savings").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
