'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "../ui/input"
import { ReactNode, useState } from "react"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"
import { ChevronDownIcon } from "lucide-react"

import { createTeam, editTeam, getTeamLeads } from "@/actions/team"
import { toast } from 'sonner'
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"



export default function TeamForm({ type, children, teamId }: { type: 'create' | 'edit', children: ReactNode, teamId?: number | null }) {
    const [open, setOpen] = useState<boolean>(false)
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
    const [teamLeadFilter, setTeamLeadFilter] = useState<string>("")
    const [teamName, setTeamName] = useState<string>("")
    const [teamLeadId, setTeamLeadId] = useState<number | null>(null)

    const queryClient = useQueryClient()

    const { data: teamLeads } = useQuery({
        queryKey: ['team-leads'],
        queryFn: async () => await getTeamLeads(),
        staleTime: 1000 * 60 * 5,
    })

    // Create team mutation
    const createTeamMutation = useMutation({
        mutationFn: ({ name, leadId }: { name: string; leadId: number }) =>
            createTeam(name, leadId),
        onMutate: async ({ name, leadId }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['teams'] })

            // Snapshot the previous value
            const previousTeams = queryClient.getQueryData(['teams'])

            // Get the team lead info for the optimistic update
            const teamLead = teamLeads?.find(lead => lead.id === leadId)

            // Optimistically update the cache with all current search params
            const searchParams = new URLSearchParams(window.location.search)
            const currentTeamName = searchParams.get('teamName') || undefined
            const currentPage = searchParams.get('page') || '1'
            const currentPageSize = Number(searchParams.get('pageSize')) || 10

            // Create optimistic team object
            const optimisticTeam = {
                id: Date.now(), // Temporary ID
                name,
                teamLeadName: teamLead?.name || 'Unknown',
                membersCount: 0,
            }

            // Update all possible query variations that might be active
            queryClient.setQueryData(['teams', { teamName: currentTeamName, page: currentPage, pageSize: currentPageSize }], (old: any) => {
                if (!old) return old
                return {
                    ...old,
                    teams: [optimisticTeam, ...old.teams],
                    totalCount: old.totalCount + 1,
                    totalPages: Math.ceil((old.totalCount + 1) / currentPageSize)
                }
            })


            // Return a context object with the snapshotted value
            return { previousTeams, optimisticTeam }
        },
        onError: (error, _, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousTeams) {
                queryClient.setQueryData(['teams'], context.previousTeams)
            }
            toast.error("Failed to create team")
            console.error("Create team error:", error)
        },
        onSuccess: (data, _, context) => {
            if (data.error) {
                // If server returns an error, roll back the optimistic update
                if (context?.previousTeams) {
                    queryClient.setQueryData(['teams'], context.previousTeams)
                }
                toast.error(data.error)
            } else {
                toast.success("Team created successfully")
                setOpen(false)
                setTeamName("")
                setTeamLeadId(null)
                setTeamLeadFilter("")
            }
        },
        onSettled: () => {
            // Always refetch after error or success to ensure we have the latest data
            queryClient.invalidateQueries({ queryKey: ['teams'] })
        }
    })

    // Edit team mutation
    const editTeamMutation = useMutation({
        mutationFn: ({ name, leadId, id }: { name: string; leadId: number; id: number }) =>
            editTeam(name, leadId, id),
        onSuccess: (data) => {
            if (data.error) {
                toast.error(data.error)
            } else {
                toast.success("Team updated successfully")
                queryClient.invalidateQueries({ queryKey: ['teams'] })
                setOpen(false)
                setTeamName("")
                setTeamLeadId(null)
                setTeamLeadFilter("")
            }
        },
        onError: (error) => {
            toast.error("Failed to update team")
            console.error("Edit team error:", error)
        }
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!teamName || !teamLeadId) {
            toast.error("Please fill in all fields")
            return
        }

        if (type === 'create') {
            createTeamMutation.mutate({ name: teamName, leadId: teamLeadId })
        } else if (type === 'edit') {
            if (!teamId) {
                toast.error("Error Getting the Team ID")
                return
            }
            editTeamMutation.mutate({ name: teamName, leadId: teamLeadId, id: teamId })
        }
    }

    const isLoading = createTeamMutation.isPending || editTeamMutation.isPending

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type === 'create' ? "Create" : "Edit"} Team</DialogTitle>
                </DialogHeader>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <Input
                        id="team-name"
                        placeholder="Team Name"
                        aria-label="Team Name"
                        onChange={(e) => setTeamName(e.target.value)}
                        disabled={isLoading}
                    />
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={popoverOpen}
                                className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
                                disabled={isLoading}
                            >
                                <span className={cn("truncate", !teamLeadFilter && "text-muted-foreground")}>
                                    {teamLeadFilter || "Select Team Lead"}
                                </span>
                                <ChevronDownIcon
                                    size={16}
                                    className="text-muted-foreground/80 shrink-0"
                                    aria-hidden="true"
                                />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
                            align="start"
                        >
                            <Command>
                                <CommandInput placeholder="Search Team Lead..." />
                                <CommandList>
                                    <CommandEmpty>No team lead found.</CommandEmpty>
                                    <CommandGroup>
                                        {teamLeads?.map((user) => (
                                            <CommandItem
                                                key={user.id}
                                                value={user.name}
                                                onSelect={() => {
                                                    setTeamLeadFilter(user.name)
                                                    setTeamLeadId(user.id)
                                                    setPopoverOpen(false)
                                                }}
                                            >
                                                {user.name}
                                                {teamLeadFilter === user.name && (
                                                    <CheckIcon size={16} className="ml-auto" />
                                                )}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <div className="flex flex-col sm:flex-row sm:justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    {type === 'create' ? 'Creating...' : 'Updating...'}
                                </>
                            ) : (
                                `${type === 'create' ? 'Create' : 'Edit'} Team`
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
