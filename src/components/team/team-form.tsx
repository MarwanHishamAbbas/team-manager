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
import { useState } from "react"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"
import { ChevronDownIcon } from "lucide-react"

import { createTeam, getTeamLeads } from "@/actions/team"
import { toast } from 'sonner'
import { useQuery } from "@tanstack/react-query"



export default function TeamForm() {
    const [open, setOpen] = useState<boolean>(false)
    const [teamLeadFilter, setTeamLeadFilter] = useState<string>("")
    const [teamName, setTeamName] = useState<string>("")
    const [teamLeadId, setTeamLeadId] = useState<number | null>(null)


    const { data: teamLeads } = useQuery({
        queryKey: ['team-leads'],
        queryFn: async () => await getTeamLeads(),
        staleTime: 1000 * 60 * 5,
    })


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!teamName || !teamLeadId) {
            toast.error("Please fill in all fields")
            return
        }

        const createdTeam = await createTeam(teamName, teamLeadId)

        if (createdTeam.error) {
            toast.error(createdTeam.error)
        } else {
            toast.success("Team created successfully")
            setOpen(false)
            setTeamName("")
            setTeamLeadId(null)
        }

    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Team</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Team</DialogTitle>
                </DialogHeader>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <Input
                        id="team-name"
                        placeholder="Team Name"
                        aria-label="Team Name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                    />
                    <Popover >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
                            >
                                <span className={cn("truncate", !teamLeadFilter && "text-muted-foreground")}>
                                    {teamLeadFilter
                                        ? teamLeads?.find((user) => user.name === teamLeadFilter)?.name
                                        : "Select Team Lead"}
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
                                    <CommandEmpty>No framework found.</CommandEmpty>
                                    <CommandGroup>
                                        {teamLeads?.map((user, idx) => (
                                            <CommandItem
                                                key={idx}
                                                value={user.name}
                                                onSelect={(currentValue) => {
                                                    setTeamLeadFilter(currentValue === teamLeadFilter ? "" : currentValue)
                                                    setTeamLeadId(user.id)
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
                        <Button type="submit">Create Team</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
