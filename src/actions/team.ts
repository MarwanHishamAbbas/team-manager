"use server";

import { db } from "@/db";
import { teams, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createTeam(name: string, teamLeadId: number) {
  try {
    const [team] = await db
      .insert(teams)
      .values({ name, teamLeadId })
      .returning();
    revalidatePath("/");
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
