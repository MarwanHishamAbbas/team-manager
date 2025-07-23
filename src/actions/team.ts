"use server";

import { db } from "@/db";
import { teams } from "@/db/schema";
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
