import React, { useState } from 'react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/data-table';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Phase1_Result, columns } from './Columns';

type Phase2PageProps = {
    jobId: string;
    Phase1_Result_data: Phase1_Result[];
    onSubmission: () => void;
}

function Phase2Page({ jobId, Phase1_Result_data, onSubmission }: Phase2PageProps) {

    const [selectMode, setSelectMode] = useState<"topX" | "minScore">("topX");
    const [topX, setTopX] = useState<number | null>(null);
    const [minScore, setMinScore] = useState<number | null>(null);
    
    const [data, setData] = useState<Phase1_Result[]>(Phase1_Result_data);
    const [submissionData, setSubmissionData] = useState<any[]>([]);

    const handleEliminate = () => {
        let sortedData:Phase1_Result[] = [...Phase1_Result_data].sort((a, b) => b.score - a.score);
        let updatedData: Phase1_Result[] = [];

        if (selectMode == "topX" && topX !== null && topX > 0) {
            // updatedData = sortedData.map((candidate, index) => ({
            //     ...candidate,
            //     isActive: index < topX
            // }))
            updatedData = sortedData.slice(0,topX);
            let submission = updatedData.map((candidate) => ({
                email: candidate.email,
                id: "0",
                jobId: jobId,
            }))
            setSubmissionData(submission);
            // console.log(updatedData)
        } else if (selectMode == "minScore" && minScore !== null && minScore > 0) {
            // updatedData = sortedData.map((candidate) => ({
            //     ...candidate,
            //     isActive: candidate.score >= minScore, // Keep candidates with score >= minScore
            // }));
            updatedData = sortedData.filter((candidate) => candidate.score >= minScore);
            let submission = updatedData.map((candidate) => ({
                email: candidate.email,
                id: "0",
                jobId: jobId,
            }))
            setSubmissionData(submission);
        }

        setData(updatedData);
    }

    const handleSubmit = async () => {
        // need make an POST api call & sending data which will then become Phase3InitialData
        
        const res = await fetch('http://localhost:8080/api/v1/rich/sendMultipleTestLink/technicalRound1',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            }
        );
        console.log(res)
        // const resp = await res.json();
        // console.log(resp);
        // set data to Phase3InitialData in parent
        
        onSubmission();
    }

    return (
        <div className='flex flex-col items-center'>
            <h1 className="text-lg font-semibold">Shortlist Candidates for Technical Test (Round 1)</h1>

            <Tabs defaultValue='TopX' className="w-[520px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value='TopX' 
                        onClick={() => {
                            setSelectMode("topX");
                            setData(Phase1_Result_data)
                        }}>
                            Select Top X Candidates
                    </TabsTrigger>
                    <TabsTrigger value='MinScore' 
                        onClick={() => {
                            setSelectMode("minScore");
                            setData(Phase1_Result_data)
                        }}>
                            Select Candidates with Score ≥ Y%
                        </TabsTrigger>
                </TabsList>
                <TabsContent value="TopX">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Top X Candidates</CardTitle>
                            <CardDescription>
                                Select the top X number of Candidates for the next phase.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-row items-end justify-between">
                            <div className='flex flex-col items-start gap-2'>
                                <Label htmlFor="X">Value of X: </Label>
                                <div>
                                    <Input id="X" defaultValue="10" onChange={(e) => setTopX(Number(e.target.value))} />
                                </div>
                            </div>
                            <div>
                                <Button onClick={handleEliminate}>Save</Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className='bg-green-700 hover:bg-green-500' onClick = {handleSubmit}>Save & Submit</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="MinScore">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select Candidates with Score ≥ Y%</CardTitle>
                            <CardDescription>
                                Select Candidates with Score ≥ Y% for the next phase.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-row items-end justify-between">
                            <div className='flex flex-col items-start gap-2'>
                                <Label htmlFor="Y">Value of Y: </Label>
                                <div>
                                    <Input id="Y" defaultValue="10" onChange={(e) => setMinScore(Number(e.target.value))}/>
                                </div>
                            </div>
                            <div>
                                <Button onClick={handleEliminate}>Save</Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className='bg-green-700 hover:bg-green-500' onClick={handleSubmit}>Save & Submit</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

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
            <div className='w-3/4'>
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}

export default Phase2Page