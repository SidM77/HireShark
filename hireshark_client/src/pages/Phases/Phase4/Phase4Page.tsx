import { useState, useEffect } from 'react';
import { DataTable } from '@/components/data-table';
import { RowSelectionState } from '@tanstack/react-table';
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
  jobDsc: string;
  Phase3_Result_data: Phase3_Result[];
  onSubmission: () => void;
}

function Phase4Page({ jobId, jobDsc, Phase3_Result_data, onSubmission }: Phase4PageProps) {

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [data, setData] = useState<Phase3_Result[]>(Phase3_Result_data);
  const [showModal, setShowModal] = useState(false);

  const jobIdPludDesc = jobId + " " + jobDsc;
  const selectedRowIds = Object.keys(rowSelection); // array of selected row ids
  const selectedCount = Object.keys(rowSelection).length;

  const selectedEmails = selectedRowIds.map((id) => ({
    id: jobIdPludDesc,
    email: data[Number(id)]?.senderEmail,
    jobId: jobId
  }));

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:8080/api/v1/rich/sendMultipleTestLink/finalRound3',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedEmails)
      }
    );
    console.log(res)
    // onSubmission();
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-semibold mb-2">
        Shortlist Candidates for the Final Interview (Last Round)
      </h1>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-sm text-muted-foreground">
          Selected: {selectedCount} candidate{selectedCount !== 1 ? "s" : ""}
        </div>
        {selectedCount > 0 && (
          <Button
            variant="link"
            onClick={() => setShowModal(true)}
            className="bg-purple-800 text-white underline text-sm"
          >
            View Selected
          </Button>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={selectedCount === 0}
        className="mb-6"
      >
        Send Email
      </Button>

      <div className="w-3/4">
        <DataTable
          columns={columns}
          data={data}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Selected Candidates</h2>
            <ul className="max-h-64 overflow-y-auto">
              {Object.keys(rowSelection).map((rowId) => {
                const candidate = data[Number(rowId)];
                return (
                  <li key={rowId} className="mb-2">
                    {candidate.senderEmail}
                  </li>
                );
              })}
            </ul>
            <Button className="mt-4" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>

  )
}

export default Phase4Page