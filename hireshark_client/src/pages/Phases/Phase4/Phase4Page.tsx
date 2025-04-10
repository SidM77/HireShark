import { useState, useEffect } from 'react';
import { DataTable } from '@/components/data-table';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Phase3_Result, columns } from './Columns'

type Phase4PageProps = {
  jobId: string;
  Phase3_Result_data: Phase3_Result[];
  onSubmission: () => void;
}

function Phase4Page({ jobId, Phase3_Result_data, onSubmission }: Phase4PageProps) {

  const [data, setData] = useState<Phase3_Result[]>(Phase3_Result_data);

  return (
    <div className='flex flex-col items-center'>
      <h1 className="text-xl font-semibold">Shortlist Candidates for the Final Interview (Last Round)</h1>
      
      <div className='w-3/4'>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

export default Phase4Page