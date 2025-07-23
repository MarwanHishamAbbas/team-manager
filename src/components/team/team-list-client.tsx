'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link";
import { Button } from "../ui/button";
import { Edit3, EyeIcon } from "lucide-react";
import TeamPagination from "./team-pagination";
import TeamForm from "./team-form";
import TeamTableSkeleton from "./team-table-skeleton";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getTeams } from "@/actions/team";



export default function TeamListClient() {
    const searchParams = useSearchParams();
    const teamName = searchParams.get('teamName') || undefined;
    const page = searchParams.get('page') || '1';
    const pageSize = Number(searchParams.get('pageSize')) || 10;

    const { data, isLoading, error } = useQuery({
        queryKey: ['teams', { teamName, page, pageSize }],
        queryFn: () => getTeams({ teamName, page, pageSize }),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">Error loading teams. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="my-10">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>Team Lead</TableHead>
                        <TableHead># of Members</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                {isLoading ? (
                    <TeamTableSkeleton pageSize={pageSize} />
                ) : (
                    <TableBody>
                        {data?.teams.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.teamLeadName}</TableCell>
                                <TableCell>{item.membersCount}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Link href={`/team/${item.id}`} className="hover:bg-transparent">
                                        <Button variant="outline" size={'icon'}>
                                            <EyeIcon className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <TeamForm type="edit" teamId={item.id}>
                                        <Button variant="outline" size={'icon'}>
                                            <Edit3 className="w-4 h-4" />
                                        </Button>
                                    </TeamForm>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                )}
            </Table>
            <TeamPagination
                page={page}
                pageSize={pageSize}
                totalPages={data?.totalPages || 1}
            />
        </div>
    );
} 