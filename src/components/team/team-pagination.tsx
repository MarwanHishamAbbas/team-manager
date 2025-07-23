'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Pagination, PaginationContent, PaginationItem } from '../ui/pagination'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const TeamPagination = ({ page = 1, pageSize = 5, totalPages = 1 }: { page: number, pageSize: number, totalPages: number }) => {
    const router = useRouter()

    return (
        <div>
            <Pagination>
                <PaginationContent className="w-full justify-between gap-3">
                    <PaginationItem >
                        <Button
                            variant="ghost"
                            className="group aria-disabled:pointer-events-none aria-disabled:opacity-50"
                            aria-disabled={page === 1 ? true : undefined}
                            disabled={Number(page) === 1}
                            role={page === 1 ? "link" : undefined}
                            onClick={() => {
                                if (page > 1) {
                                    router.push(`/?page=${page - 1}&pageSize=${pageSize}`)
                                }
                            }}
                        >
                            <ArrowLeftIcon
                                className="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5"
                                size={16}
                                aria-hidden="true"
                            />
                            Previous
                        </Button>
                    </PaginationItem>
                    <PaginationItem>
                        <Button
                            variant="ghost"
                            className="group aria-disabled:pointer-events-none aria-disabled:opacity-50"
                            disabled={page >= totalPages}
                            onClick={() => {
                                router.push(`/?page=${Number(page) + 1}&pageSize=${pageSize}`)
                            }}
                        >
                            Next
                            <ArrowRightIcon
                                className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                                size={16}
                                aria-hidden="true"
                            />
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            <Select onValueChange={(value) => {
                router.push(`/?page=${page}&pageSize=${value}`)
            }} defaultValue={pageSize.toString()} aria-label="Results per page">
                <SelectTrigger
                    id="results-per-page"
                    className="w-fit whitespace-nowrap"
                >
                    <SelectValue placeholder="Select number of results" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="5">5 / page</SelectItem>
                    <SelectItem value="10">10 / page</SelectItem>
                    <SelectItem value="20">20 / page</SelectItem>
                    <SelectItem value="50">50 / page</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

export default TeamPagination