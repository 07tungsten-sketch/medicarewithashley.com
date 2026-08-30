import {
  bigint,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contactSubmissionsTable = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  topic: text("topic"),
  preferredContact: text("preferred_contact"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * One shared row stores the notification outage circuit-breaker state.
 * Epoch milliseconds keep the configurable failure and cooldown windows
 * independent of the database session timezone.
 */
export const notificationOutageStateTable = pgTable(
  "notification_outage_state",
  {
    id: text("id").primaryKey(),
    failureCount: integer("failure_count").notNull().default(0),
    failureWindowStartedAt: bigint("failure_window_started_at", {
      mode: "number",
    }),
    lastAlertAt: bigint("last_alert_at", { mode: "number" }),
    lastAlertToken: text("last_alert_token"),
  },
);

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissionsTable)
  .omit({ id: true, createdAt: true })
  .extend({
    firstName: z.string().min(1).max(100),
    lastName: z.string().max(100).optional().transform((v) => v ?? ""),
    email: z.string().max(254).optional().transform((v) => v ?? ""),
    phone: z.string().max(30).optional(),
    topic: z.string().max(200).optional(),
    preferredContact: z.string().max(50).optional(),
    message: z.string().max(5000).optional(),
  });
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissionsTable.$inferSelect;
