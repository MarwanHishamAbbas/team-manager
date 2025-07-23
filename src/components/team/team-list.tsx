import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { db } from "@/db";
import { teamMembers, teams as teamsTable, users } from "@/db/schema";
import { eq, like } from "drizzle-orm";
import Link from "next/link";
import { Button } from "../ui/button";
import { EyeIcon } from "lucide-react";




export default async function TeamList({ searchParams }: { searchParams: Promise<{ teamName: string }> }) {
    const { teamName } = await searchParams

    const query = db
        .select({
            id: teamsTable.id,
            name: teamsTable.name,
            teamLeadName: users.name,
            membersCount: db.$count(teamMembers, eq(teamMembers.teamId, teamsTable.id)),
        })
        .from(teamsTable)
        .innerJoin(users, eq(teamsTable.teamLeadId, users.id));

    if (teamName) {
        query.where(like(teamsTable.name, `%${teamName}%`));
    }

    query.orderBy(teamsTable.createdAt);

    const teams = await query;


    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>Team Lead</TableHead>
                        <TableHead># of Members</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teams.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.teamLeadName}</TableCell>
                            <TableCell>{item.membersCount}</TableCell>
                            <TableCell>
                                <Link href={`/team/${item.id}`} className="hover:bg-transparent">
                                    <Button variant="outline" size={'icon'}>
                                        <EyeIcon className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
