'use client'

import React, { useCallback } from 'react'
import { Button } from '../ui/button'
import { Pagination, PaginationContent, PaginationItem } from '../ui/pagination'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const TeamPagination = ({ page = '1', pageSize = 10, totalPages = 1 }: { page: string, pageSize: number, totalPages: number }) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const teamName = searchParams.get('teamName')
    const pathname = usePathname()


    const createQueryString = useCallback(
        (name: string, value: number) => {
            const params = new URLSearchParams(searchParams)
            if (value) {
                params.set(name, value.toString())
            } else {
                params.delete(name)
            }

            return params
        },
        [searchParams]
    )


    const handleNextPage = () => {
        router.replace(`${pathname}?${createQueryString('page', (parseInt(page) + 1))}`)
    }

    const handlePreviousPage = () => {

        router.replace(`${pathname}?${createQueryString('page', parseInt(page) - 1)}`)
    }



    return (

        <Pagination className='mt-5'>
            <PaginationContent className="w-full justify-between gap-3">
                <PaginationItem >
                    <Button
                        variant="ghost"
                        className="group aria-disabled:pointer-events-none aria-disabled:opacity-50"
                        aria-disabled={parseInt(page) === 1 ? true : undefined}
                        disabled={Number(page) === 1}
                        role={parseInt(page) === 1 ? "link" : undefined}
                        onClick={handlePreviousPage}
                    >
                        <ArrowLeftIcon
                            className="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5"
                            size={16}
                            aria-hidden="true"
                        />
                        Previous
                    </Button>
                </PaginationItem>
                <Select onValueChange={(value) => {
                    router.push(`/?page=1&pageSize=${value}${teamName ? `&teamName=${teamName}` : ""}`)
                }} defaultValue={String(pageSize)} aria-label="Results per page">
                    <SelectTrigger
                        id="results-per-page"
                        className="w-fit whitespace-nowrap"
                    >
                        <SelectValue placeholder="Select number of results" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10 / page</SelectItem>
                        <SelectItem value="20">20 / page</SelectItem>
                        <SelectItem value="50">50 / page</SelectItem>
                        <SelectItem value="100">100 / page</SelectItem>
                    </SelectContent>
                </Select>
                <PaginationItem>
                    <Button
                        variant="ghost"
                        className="group aria-disabled:pointer-events-none aria-disabled:opacity-50"
                        disabled={parseInt(page) >= totalPages}
                        onClick={handleNextPage}
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


    )

}
export default TeamPagination