import { pgTable, text, integer, numeric, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const audits = pgTable("audits", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  publicId: text("public_id").notNull().unique(),
  teamSize: integer("team_size").notNull(),
  primaryUseCase: text("primary_use_case").notNull(),
  totalMonthlySpend: numeric("total_monthly_spend", { precision: 12, scale: 2 }).notNull(),
  totalMonthlySavings: numeric("total_monthly_savings", { precision: 12, scale: 2 }).notNull(),
  totalAnnualSavings: numeric("total_annual_savings", { precision: 12, scale: 2 }).notNull(),
  efficiencyScore: integer("efficiency_score").notNull(),
  summary: text("summary").notNull(),
  publicPayload: jsonb("public_payload").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  auditId: text("audit_id").references(() => audits.id, { onDelete: "cascade" }).notNull(),
  email: text("email").notNull(),
  companyName: text("company_name"),
  role: text("role"),
  teamSize: integer("team_size"),
  monthlySavings: numeric("monthly_savings", { precision: 12, scale: 2 }).notNull(),
  isHighSavings: boolean("is_high_savings").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
