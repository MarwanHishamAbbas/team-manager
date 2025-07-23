
import TeamForm from "@/components/team/team-form";
import TeamList from "@/components/team/team-list";
import TeamSearch from "@/components/team/team-search";

import { Suspense } from "react";


export default async function Home({ searchParams }: { searchParams: Promise<{ teamName: string, page: number, pageSize: number }> }) {


  return (
    <div className="max-w-7xl mx-auto my-10 px-3">
      <Suspense>
        <TeamSearch />
      </Suspense>
      <TeamForm />
      <TeamList searchParams={searchParams} />
    </div>
  );
}
