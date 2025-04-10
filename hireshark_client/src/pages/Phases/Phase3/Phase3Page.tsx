import { useState, useEffect } from 'react';
import { DataTable } from '@/components/data-table';
import { Phase2_Result, columns } from './Columns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Phase3PageProps = {
  jobId: string;
  Phase2_Result_data: Phase2_Result[];
  onSubmission: () => void;
}

function Phase3Page({ jobId, Phase2_Result_data, onSubmission }: Phase3PageProps) {

  const [selectMode, setSelectMode] = useState<"topX" | "minScore">("topX");
  const [topX, setTopX] = useState<number | null>(null);
  const [minScore, setMinScore] = useState<number | null>(null);

  const [data, setData] = useState<Phase2_Result[]>([]);
  const [submissionData, setSubmissionData] = useState<any[]>([]);

  const handleEliminate = () => {
    
    let updatedData: Phase2_Result[] = [];

    if (selectMode == "topX" && topX !== null && topX > 0) {
      // updatedData = sortedData.map((candidate, index) => ({
      //     ...candidate,
      //     isActive: index < topX
      // }))
      updatedData = data.slice(0, topX);
      let submission = updatedData.map((candidate) => ({
        email: candidate.senderEmail,
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
      updatedData = data.filter((candidate) => candidate.testScore >= minScore);
      let submission = updatedData.map((candidate) => ({
        email: candidate.senderEmail,
        id: "0",
        jobId: jobId,
      }))
      setSubmissionData(submission);
    }

    setData(updatedData);
  }

  const handleSubmit = async () => {
    // need make an POST api call & sending data which will then become Phase3InitialData

    const res = await fetch('http://localhost:8080/api/v1/rich/sendMultipleTestLink/oralRound2',
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

  useEffect(() => {
    let sortedData: Phase2_Result[] = [...Phase2_Result_data].sort((a, b) => {
      // Prioritize non-cheaters
      if (a.cheating !== b.cheating) {
        return a.cheating ? 1 : -1; // cheaters go below
      }
      // If both are same in cheating status, sort by testScore descending
      return b.testScore - a.testScore;
    });

    setData(sortedData);
  }, [])

  return (
    <div className='flex flex-col items-center'>
      <h1 className="text-lg font-semibold">Shortlist Candidates for Oral Test (Round 2)</h1>

      <Tabs defaultValue='TopX' className="w-[520px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value='TopX'
            onClick={() => {
              setSelectMode("topX");
              setData(Phase2_Result_data)
            }}>
            Select Top X Candidates
          </TabsTrigger>
          <TabsTrigger value='MinScore'
            onClick={() => {
              setSelectMode("minScore");
              setData(Phase2_Result_data)
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
              <Button className='bg-green-700 hover:bg-green-500' onClick={handleSubmit}>Save & Submit</Button>
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
                  <Input id="Y" defaultValue="10" onChange={(e) => setMinScore(Number(e.target.value))} />
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
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

export default Phase3Page