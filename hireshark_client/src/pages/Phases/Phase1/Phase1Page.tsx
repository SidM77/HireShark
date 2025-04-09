import React, { useState, useEffect } from 'react'
import { columns } from './Columns';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Candidate } from '@/pages/Scratch/Columns';

// this is new and i so donot understand TYPESCRIPT
type Phase1PageProps = {
    onSubmission: () => void;
}

function Phase1Page({ onSubmission }: Phase1PageProps) {

    const [data, setData] = useState<Candidate[]>([]);

    async function getData() {
        const res = await fetch(
            'http://localhost:8080/api/v1/getInfoWithoutResumePDF/all',
            {
                method: 'GET',
            }
        );
        const resp = await res.json();
        console.log(resp)
        setData(resp);
    }

    // dummy function to simulate submission of candidate profiles to deepseek
    const handleSubmitPhase1 = () => {
        onSubmission();
        console.log("resumes submitted to deepseek")
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className='flex flex-col items-center'>
            <div className='text-center w-3/4'>
                <p className="text-3xl font-semibold">AI Ranker for Candidates</p>
                <p className="text-md text-gray-500">
                    Submit the list of candidates from the table below to our AI-powered resume ranker, which will evaluate and rank them based on their alignment with the provided job description. To proceed, click the Submit Resumes button. If you wish to modify the job description, use the Update JD button.
                </p>
            </div>
            <div className='flex flex-row w-2/5 justify-between my-4'>
                <Button 
                    className='bg-green-700 hover:bg-green-500'
                    onClick={handleSubmitPhase1}>
                        Submit Resumes
                </Button>
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