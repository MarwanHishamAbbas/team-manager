import { TableBody, TableCell, TableRow } from "@/components/ui/table";

interface TeamTableSkeletonProps {
    pageSize: number;
}

export default function TeamTableSkeleton({ pageSize }: TeamTableSkeletonProps) {
    return (
        <TableBody>
            {Array.from({ length: pageSize }, (_, index) => (
                <TableRow key={index}>
                    <TableCell>
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </TableCell>
                    <TableCell>
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </TableCell>
                    <TableCell>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                    </TableCell>
                    <TableCell>
                        <div className="flex gap-2">
                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
} 