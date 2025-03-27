import { Candidate, columns } from './Columns'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
// import NewJobModal from './NewJobModal'
import { useState, useEffect } from 'react'


export default function TablePage() {
    const [data, setData] = useState<Candidate[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    
    // fetching data
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
  
    useEffect(() => {
      getData();  
    }, []); 
  
    // function to create a job:
    // async function handleCreateJob(jobTitle: string, jobDescription: string) {
      
    //   const payload = {
    //     jobTitle,
    //     jobDescription,
    //     emails
    //   }

    //   console.log(payload);
    //   setOpen(false);
    // }

    // make email list from data:
    const emails = data.map((candidate: any) => ({ id: candidate.id.timestamp, email: candidate.senderEmail }));

    const handleSendEmails = async () => {
      const res = await fetch('http://localhost:8080/api/v1/sendMultipleTestLink/oralRound1', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emails),
      })

      const resp = res.json();
      console.log(resp);
    }

    return (
      <section className="py-24">
        
        <div className="container">
          <h1 className="text-3xl font-bold my-3">All Users</h1>
          {/* <Button 
            variant="outline"
            onClick={() => setOpen(true)}
            >
              <Plus />Create Job Opening
          </Button> */}
          <Button 
            variant="outline"
            onClick={handleSendEmails}
            >
              Send Test Link
          </Button>
          {/* <NewJobModal open={open} setOpen={setOpen} onCreateJob={handleCreateJob} /> */}
          <DataTable columns={columns} data={data} />
        </div>
      </section>
    );
  }