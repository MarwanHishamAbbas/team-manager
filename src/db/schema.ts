import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { integer, serial, text } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text().notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  teamLeadId: integer("team_lead_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teamMembers = pgTable(
  "team_members",
  {
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, {
        onDelete: "cascade",
      }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    index("team_member_index").on(table.teamId, table.userId),
    primaryKey({ columns: [table.teamId, table.userId] }),
  ]
);

export const usersRelations = relations(users, ({ one }) => ({
  // A user can lead one team
  ledTeam: one(teams, {
    fields: [users.id],
    references: [teams.teamLeadId],
  }),
  // A user can be a member of one team (through team_members)
  teamMembership: one(teamMembers, {
    fields: [users.id],
    references: [teamMembers.userId],
  }),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  // Each team has one team lead
  teamLead: one(users, {
    fields: [teams.teamLeadId],
    references: [users.id],
  }),
  // Each team has many members
  members: many(teamMembers),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  // Each membership record belongs to one team
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  // Each membership record belongs to one user
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

// Type definitions for better TypeScript support
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
