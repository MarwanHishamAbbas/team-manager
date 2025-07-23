import TeamForm from "@/components/team/team-form";
import TeamList from "@/components/team/team-list";
import TeamSearch from "@/components/team/team-search";
import { db } from "@/db";
import { teams as teamsTable, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Suspense } from "react";


export default async function Home({ searchParams }: { searchParams: Promise<{ teamName: string }> }) {
  const teamLeads = await db
    .selectDistinct({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .innerJoin(teamsTable, eq(users.id, teamsTable.teamLeadId))
    .orderBy(users.name);


  return (
    <div className="max-w-7xl mx-auto my-10 px-3">
      <Suspense>
        <TeamSearch />
      </Suspense>
      <TeamForm teamLeads={teamLeads} />
      <TeamList searchParams={searchParams} />
    </div>
  );
}
