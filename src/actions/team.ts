"use server";

import { db } from "@/db";
import { teams, users } from "@/db/schema";
import { eq } from "drizzle-orm";

import { teams as teamsTable, teamMembers } from "@/db/schema";
import { ilike, asc, count, desc } from "drizzle-orm";

export async function createTeam(name: string, teamLeadId: number) {
  try {
    const [team] = await db
      .insert(teams)
      .values({ name, teamLeadId })
      .returning();

    return { team };
  } catch (error: any) {
    if (error.cause.constraint_name === "teams_name_unique") {
      return { error: "Team already exists" };
    }
  }

  return { error: "Failed to create team" };
}

export async function editTeam(
  name: string,
  teamLeadId: number,
  teamId: number
) {
  try {
    const [team] = await db
      .update(teams)
      .set({ name, teamLeadId })
      .where(eq(teams.id, teamId));
    return { team };
  } catch (error: any) {
    if (error.cause.constraint_name === "teams_name_unique") {
      return { error: "Team already exists" };
    }
  }

  return { error: "Failed to create team" };
}

export async function getTeamLeads() {
  const teamLeads = await db
    .selectDistinct({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .innerJoin(teams, eq(users.id, teams.teamLeadId))
    .orderBy(users.name);

  return teamLeads;
}

export async function getTeams(params: {
  teamName?: string;
  page?: string;
  pageSize?: number;
}) {
  const { teamName, page = "1", pageSize = 5 } = params;

  try {
    const teams = await db
      .select({
        id: teamsTable.id,
        name: teamsTable.name,
        teamLeadName: users.name,
        membersCount: db.$count(
          teamMembers,
          eq(teamMembers.teamId, teamsTable.id)
        ),
      })
      .from(teamsTable)
      .innerJoin(users, eq(teamsTable.teamLeadId, users.id))
      .where(teamName ? ilike(teamsTable.name, `%${teamName}%`) : undefined)
      .limit(Number(pageSize))
      .offset((parseInt(page) - 1) * Number(pageSize))
      .orderBy(desc(teamsTable.createdAt), asc(teamsTable.id));

    const [teamsCount] = await db
      .select({ count: count() })
      .from(teamsTable)
      .where(teamName ? ilike(teamsTable.name, `%${teamName}%`) : undefined);

    const totalPages = Math.ceil(teamsCount.count / Number(pageSize));

    return {
      teams,
      totalPages,
      totalCount: teamsCount.count,
    };
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw new Error("Failed to fetch teams");
  }
}
