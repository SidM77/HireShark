import React, { useState } from 'react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/data-table';
import { Phase1_Result, columns } from './Columns';

type Phase2PageProps = {
    Phase1_Result_data: Phase1_Result[];
}

function Phase2Page({ Phase1_Result_data }: Phase2PageProps) {

    const [selectMode, setSelectMode] = useState<"topX" | "minScore">("topX");
    const [topX, setTopX] = useState<number | null>(null);
    const [minScore, setMinScore] = useState<number | null>(null);
    const [data, setData] = useState<Phase1_Result[]>(Phase1_Result_data);

    const handleEliminate = () => {
        let updatedData = [...data].sort((a, b) => b.score - a.score);

        if (selectMode == "topX" && topX !== null && topX > 0) {
            updatedData = updatedData.map((candidate, index) => ({
                ...candidate,
                isActive: index < topX, // Only keep top X active
            }));
        } else if (selectMode == "minScore" && minScore !== null && minScore > 0) {
            updatedData = updatedData.map((candidate) => ({
                ...candidate,
                isActive: candidate.score >= minScore, // Keep candidates with score >= minScore
            }));
        }

        setData(updatedData);
    }

    return (
        <div className='flex flex-col items-center'>
            <h1 className="text-lg font-semibold">Candidate Selection</h1>

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
            <div className='w-3/4'>
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    )
}

export default Phase2Page