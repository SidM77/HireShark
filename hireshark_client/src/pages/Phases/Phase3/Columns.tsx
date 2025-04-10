"use client"

import { ColumnDef } from "@tanstack/react-table"

import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Phase3_Result = {
    senderEmail: string;
    audioCheatCount: number;
    isCheating: boolean;
    multipleFacesDetected: false;
    susSpikeCount: number;
    testScore: number;
    totalHeadMovements: number;
}

// const handlePDFview = (candidateEmail: string) => {
//     window.open(`http://localhost:8080/api/v1/getPDF/${candidateEmail}`, '_blank');
// }

export const columns: ColumnDef<Phase3_Result>[] = [
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
        accessorKey: "isCheating",
        header: "Cheating",
        cell: ({ row }) => {
            <span className={row.original.isCheating ? "text-red-500" : "text-green-600"}>
                 {row.original.isCheating ? "Possible" : "Not Detected"}
            </span>
        }
    }
]
