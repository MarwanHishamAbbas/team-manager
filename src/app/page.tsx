
import TeamForm from "@/components/team/team-form";
import TeamList from "@/components/team/team-list";

import TeamSearch from "@/components/team/team-search";
import { Button } from "@/components/ui/button";



export default async function Home() {
  return (
    <div className="max-w-7xl mx-auto my-10 px-3">

      <TeamSearch />
      <TeamForm type="create">
        <Button>New Team</Button>
      </TeamForm>
      <TeamList />
    </div>
  );
}
