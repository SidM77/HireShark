"use client"

import { ColumnDef } from "@tanstack/react-table"

import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Candidate = {
    date: string
    senderEmail: string
    skills: string    // to be kept as an array of strings
}

const handlePDFview = (candidateEmail: string) => {
    window.open(`http://localhost:8080/api/v1/getPDF/${candidateEmail}`, '_blank');
}

export const columns: ColumnDef<Candidate>[] = [
    {
        accessorKey: "senderEmail",
        header: (({ column }) => {
            return (
                <Button
                    variant="outline"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }),
    },
    // {
    //     accessorKey: "resume",
    //     header: "Resume",
    // },
    {
        accessorKey: "skills",
        header: "Skills",
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue('date'))
            const formatted = date.toLocaleDateString()
            return <div className="font-medium">{formatted}</div>
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const cand = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(cand.senderEmail)}
                        >
                            Copy Email ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Candidate</DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handlePDFview(cand.senderEmail)}    
                        >View Resume</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]
