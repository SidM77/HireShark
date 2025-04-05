"use client"

import { ColumnDef } from "@tanstack/react-table"

import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CandidateP1 = {
    id: string
    senderEmail: string
    isActive: boolean
}

// const handlePDFview = (candidateEmail: string) => {
//     window.open(`http://localhost:8080/api/v1/getPDF/${candidateEmail}`, '_blank');
// }

export const columns: ColumnDef<CandidateP1>[] = [
    {
        accessorKey: "senderEmail",
        header: "Email"
    },
    // {
    //     accessorKey: "resume",
    //     header: "Resume",
    // },
    // {
    //     accessorKey: "resumeScore",
    //     header: ({ column }) => {
    //         return (
    //           <Button
    //             variant="outline"
    //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //           >
    //             Resume Score
    //             <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() ? "text-blue-500" : ""}`} />
    //           </Button>
    //         );
    //       },
    //     sortingFn: (rowA, rowB) => {
    //         if (rowA.original.isActive === rowB.original.isActive) {
    //             return rowB.original.resumeScore - rowA.original.resumeScore;
    //         }
    //         return rowA.original.isActive ? -1 : 1;
    //     },

    // },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
            <span className={row.original.isActive ? "text-green-600" : "text-red-500"}>
                {row.original.isActive ? "Active" : "Eliminated"}
            </span>
        ),
    },
]
