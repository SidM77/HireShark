import { Candidate, columns } from './Columns'
import { DataTable } from './data_table';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Job } from '../AllJobs/AllJobsPage';

export default function Dashboard() {

    const location = useLocation();
    let humanReadableJobId = location.state.humanReadableJobId

    const fetchSpecificJobData = async (humanReadableJobId: string) => {

        const res = await fetch(`http://localhost:8080/api/v1/findJobById/${humanReadableJobId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            } 
        })

        const resp: Job = await res.json();
        console.log(resp)
    }

    useEffect(() => {
        fetchSpecificJobData(humanReadableJobId);
    }, []);

    let ogData: Candidate[] = [
        {
            id: "pqr",
            senderEmail: "pqr@gmail.com",
            resumeScore: 85,
            isActive: true
        },
        {
            id: "abc",
            senderEmail: "abc@gmail.com",
            resumeScore: 92,
            isActive: true
        },
        {
            id: "rst",
            senderEmail: "rst@gmail.com",
            resumeScore: 77,
            isActive: true
        },
        {
            id: "xyz",
            senderEmail: "xyz@gmail.com",
            resumeScore: 73,
            isActive: true
        },
        {
            id: "spq",
            senderEmail: "spq@gmail.com",
            resumeScore: 78,
            isActive: true
        }
    ];

    const [selectMode, setSelectMode] = useState<"topX" | "minScore">("topX");
    const [topX, setTopX] = useState<number | null>(null);
    const [minScore, setMinScore] = useState<number | null>(null);
    const [data, setData] = useState<Candidate[]>(ogData);

    const handleEliminate = () => {
        let updatedData = [...data].sort((a, b) => b.resumeScore - a.resumeScore);

        if (selectMode == "topX" && topX !== null && topX > 0) {
            updatedData = updatedData.map((candidate, index) => ({
                ...candidate,
                isActive: index < topX, // Only keep top X active
            }));
        } else if (selectMode == "minScore" && minScore !== null && minScore > 0) {
            updatedData = updatedData.map((candidate) => ({
                ...candidate,
                isActive: candidate.resumeScore >= minScore, // Keep candidates with score >= minScore
            }));
        }

        setData(updatedData);
    }

    return (
        <section className="py-10">
            <h2 className="text-lg font-semibold">Candidate Selection</h2>

            <RadioGroup
                value={selectMode}
                onValueChange={(value) => setSelectMode(value as "topX" | "minScore")}
                className='flex'
            >
                <Label className="flex items-center gap-2">
                    <RadioGroupItem value="topX" /> Select Top X Candidates
                </Label>
                <Label className="flex items-center gap-2">
                    <RadioGroupItem value="minScore" /> Select Candidates with Score ≥ Y%
                </Label>
            </RadioGroup>
            
            {/* <div className="flex gap-2">
                <Input
                    type="number"
                    placeholder="Enter number of candidates to proceed"
                    value={topX}
                    onChange={(e) => setTopX(Number(e.target.value))}
                    className="w-64"
                />
                <span>OR</span>
                <Input
                    type='number'
                    placeholder='Enter minimum resume score %'
                    value={minScore ?? ""}
                    onChange={(e) => setMinScore(Number(e.target.value))}
                    className='w-64'
                />
                <Button onClick={handleEliminate}>Eliminate Rest</Button>
            </div> */}
            <DataTable columns={columns} data={data} />
        </section>
    )
}