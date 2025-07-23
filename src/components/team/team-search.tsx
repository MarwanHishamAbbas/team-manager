'use client'

import React, { useCallback } from 'react'
import { Input } from '../ui/input'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from '@/hooks/use-debounce'

const TeamSearch = () => {

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const teamName = searchParams.get('teamName') || ''


    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams)
            if (value) {
                params.set(name, value)
            } else {
                params.delete(name)
            }

            return params
        },
        [searchParams]
    )
    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.push(`${pathname}?${createQueryString('teamName', value)}`)
    }, 500)


    return (
        <div>
            <Input type="text" placeholder="Search" defaultValue={teamName} onChange={(e) => debouncedSearch(e.target.value)} />
        </div>
    )
}

export default TeamSearch