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
import { asc, count, eq, like } from "drizzle-orm";
import Link from "next/link";
import { Button } from "../ui/button";
import { EyeIcon } from "lucide-react";

import TeamPagination from "./team-pagination";



export default async function TeamList({ searchParams }: { searchParams: Promise<{ teamName: string, page: number, pageSize: number }> }) {
    const { teamName, page, pageSize } = await searchParams

    const teams = await db
        .select({
            id: teamsTable.id,
            name: teamsTable.name,
            teamLeadName: users.name,
            membersCount: db.$count(teamMembers, eq(teamMembers.teamId, teamsTable.id)),
        })
        .from(teamsTable)
        .innerJoin(users, eq(teamsTable.teamLeadId, users.id))
        .where(teamName ? like(teamsTable.name, `%${teamName}%`) : undefined)
        .limit(Number(pageSize) || 5)
        .offset((Number(page) - 1 || 0) * (Number(pageSize) || 5))
        .orderBy(asc(teamsTable.id))

    const [teamsCount] = await db.select({ count: count() }).from(teamsTable) || 0;
    const totalPages = Math.ceil(teamsCount.count / pageSize);

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
            <TeamPagination page={page} pageSize={pageSize} totalPages={totalPages} />
        </div>
    );
}
