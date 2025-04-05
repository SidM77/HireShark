import React, { useState, useEffect } from 'react'
import { CandidateP1, columns } from './Columns';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

function Phase1Page() {
    let dummyData: CandidateP1[] = [
        {
            id: "pqr",
            senderEmail: "pqr@gmail.com",
            isActive: true
        },
        {
            id: "abc",
            senderEmail: "abc@gmail.com",
            isActive: true
        },
        {
            id: "rst",
            senderEmail: "rst@gmail.com",
            isActive: true
        },
        {
            id: "xyz",
            senderEmail: "xyz@gmail.com",
            isActive: true
        },
        {
            id: "spq",
            senderEmail: "spq@gmail.com",
            isActive: true
        }
    ];

    const [data, setData] = useState<CandidateP1[]>(dummyData);
    return (
        <div className='flex flex-col items-center'>
            <div className='text-center w-3/4'>
                <p className="text-3xl font-semibold">AI Ranker for Candidates</p>
                <p className="text-md text-gray-500">
                    Submit the list of candidates from the table below to our AI-powered resume ranker, which will evaluate and rank them based on their alignment with the provided job description. To proceed, click the Submit Resumes button. If you wish to modify the job description, use the Update JD button.
                </p>
            </div>
            <div className='flex flex-row w-2/5 justify-between my-4'>
                <Button className='bg-green-700 hover:bg-green-500'>Submit Resumes</Button>
                <Button>Update Job Description</Button>
            </div>
            <div>
                {/*
                    can use this loader when apis are integrated.
                */}
                {/* <Loader2
                    className={cn('h-16 w-16 text-primary/60 animate-spin')}
                /> */}
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}

export default Phase1Page