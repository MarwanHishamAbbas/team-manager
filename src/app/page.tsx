import TeamList from "@/components/team/team-list";
import TeamSearch from "@/components/team/team-search";




export default async function Home() {
  return (
    <div className="max-w-7xl mx-auto my-10 px-3">
      <TeamSearch />
      <TeamList />
    </div>
  );
}
