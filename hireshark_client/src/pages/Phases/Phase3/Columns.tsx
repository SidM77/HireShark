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
export type Phase2_Result = {
    senderEmail: string;
    audioCheatCount: number;
    cheating: boolean;
    multipleFacesDetected: false;
    susSpikeCount: number;
    testScore: number;
    totalHeadMovements: number;
}

const handlePDFview = (candidateEmail: string) => {
    window.open(`http://localhost:8080/api/v1/getPDF/${candidateEmail}`, '_blank');
}

export const columns: ColumnDef<Phase2_Result>[] = [
    {
        accessorKey: "senderEmail",
        header: "Email"
    },
    // {
    //     accessorKey: "resume",
    //     header: "Resume",
    // },
    {
        accessorKey: "testScore",
        header: ({ column }) => {
            return (
                <Button
                    variant="outline"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Technical Test Score
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? "text-blue-500" : ""}`} />
                </Button>
            );
        },
        sortingFn: (rowA, rowB) => {
            return rowB.original.testScore - rowA.original.testScore;
        },

    },
    {
        accessorKey: "cheating",
        header: "Cheating",
        cell: ({ row }) => {
            return (
                <span className={row.original.cheating ? "text-red-500" : "text-green-600"}>
                    {row.original.cheating ? "Possible" : "Not Detected"}
                </span>
            )
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
