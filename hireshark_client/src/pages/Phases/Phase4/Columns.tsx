"use client"

import { ColumnDef } from "@tanstack/react-table"

import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { ExternalLink, FileText, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox";
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
export type Phase3_Result = {
    senderEmail: string;
    questions: Record<string, string>;
    answers: Record<string, string>;
}

const handlePDFview = (candidateEmail: string) => {
    window.open(`http://localhost:8080/api/v1/getPDF/${candidateEmail}`, '_blank');
}

const handleViewQA = (questions: Record<string, string>, answers: Record<string, string>) => {
    const qaWindow = window.open('', '_blank');
    qaWindow?.document.write(`
      <html>
        <head><title>Questions & Answers</title></head>
        <body>
          <h2>Questions & Answers</h2>
          ${Object.entries(questions).map(([key, question]) => `
            <div style="margin-bottom: 20px;">
              <p><strong>Q${key}:</strong> ${question}</p>
              <p><strong>A${key}:</strong> ${answers[key]}</p>
            </div>
          `).join('')}
        </body>
      </html>
    `);
};

export const columns: ColumnDef<Phase3_Result>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center space-x-2">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center space-x-2">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "senderEmail",
        header: "Email"
    },
    // {
    //     accessorKey: "resume",
    //     header: "Resume",
    // },
    {
        header: "View QA",
        cell: ({ row }) => {
            const cand = row.original
            return (
                <Button
                    onClick={() => handleViewQA(cand.questions, cand.answers)}
                    className="flex items-center gap-2 bg-gray-600"
                >
                    <ExternalLink className="h-4 w-4" />
                    View Q&A
                </Button>
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
