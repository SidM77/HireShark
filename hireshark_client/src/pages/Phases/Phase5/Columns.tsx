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
export type Phase4_Result = {
    senderEmail: string;
    jobId: string;
    techKnowledge: number;
    communication: number;
    problemSolving: number;
    comments: string;
}

const handlePDFview = (candidateEmail: string) => {
    window.open(`http://localhost:8080/api/v1/getPDF/${candidateEmail}`, '_blank');
}

const handleViewFeedback = (candidate: Phase4_Result) => {
    const qaWindow = window.open('', '_blank');
    if (!qaWindow) return;
  
    qaWindow.document.write(`
      <html>
        <head>
          <title>Candidate Feedback</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f6f8;
              padding: 30px;
              margin: 0;
            }
            h2 {
              text-align: center;
              color: #333;
              margin-bottom: 30px;
            }
            .section {
              background: #ffffff;
              padding: 20px 25px;
              margin-bottom: 30px;
              border-radius: 10px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .section h3 {
              font-size: 20px;
              margin-bottom: 20px;
              color: #007bff;
              border-bottom: 2px solid #eee;
              padding-bottom: 8px;
            }
            .detail {
              margin-bottom: 15px;
              font-size: 16px;
            }
            .detail strong {
              color: #555;
              display: inline-block;
              width: 180px;
            }
          </style>
        </head>
        <body>
          <h2>Candidate Feedback Summary</h2>
  
          <div class="section">
            <h3>Overall Ratings</h3>
            <div class="detail"><strong>Technical Knowledge:</strong> ${candidate.techKnowledge}</div>
            <div class="detail"><strong>Communication:</strong> ${candidate.communication}</div>
            <div class="detail"><strong>Problem Solving:</strong> ${candidate.problemSolving}</div>
            <div class="detail"><strong>Comments:</strong> ${candidate.comments || "N/A"}</div>
          </div>
        </body>
      </html>
    `);
  };
  

export const columns: ColumnDef<Phase4_Result>[] = [
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
        header: "Total Score (Out of 30)",
        cell: ({ row }) => {
            const candidate = row.original;
            const score = candidate.techKnowledge + candidate.communication + candidate.problemSolving;
            return (
                <h3>{score}</h3>
            )
        }
    },
    {
        header: "View Feedback",
        cell: ({ row }) => {
            const cand = row.original
            return (
                <Button
                    onClick={() => handleViewFeedback(cand)}
                    className="flex items-center gap-2 bg-gray-600"
                >
                    <ExternalLink className="h-4 w-4" />
                    View Feedback
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
