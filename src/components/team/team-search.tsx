'use client'

import React, { useCallback } from 'react'
import { Input } from '../ui/input'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from '@/hooks/use-debounce'
import TeamForm from './team-form'
import { Button } from '../ui/button'
import { PlusIcon } from 'lucide-react'


const TeamSearch = () => {

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const teamName = searchParams.get('teamName') || ''


    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams)
            params.delete('page')
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
        router.replace(`${pathname}?${createQueryString('teamName', value)}`)
    }, 500)


    return (
        <div className='mb-5 flex items-center justify-between'>
            <Input type="text" placeholder="Search Team Name..." className='w-1/4' defaultValue={teamName} onChange={(e) => debouncedSearch(e.target.value)} />
            <TeamForm type="create">
                <Button className='gap-2' variant="outline">
                    <PlusIcon className="w-4 h-4" />
                    New Team
                </Button>
            </TeamForm>
        </div>
    )
}

export default TeamSearch