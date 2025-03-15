import React, {useState, useEffect} from 'react'
import { Plus } from 'lucide-react'
import NewJobModal from './NewJobModal';

interface Job {
  id: string;
  jobTitle: string;
  jobDescription: string;
}

function AllJobsPage() {

  const [open, setOpen] = useState<boolean>(false);

  const allJobs = [
    {
      id: "abc123",
      jobTitle: "SDE-1 Fresher",
      jobDescription: "need a good fresher knowing java framework"
    },
    {
      id: "er4a23",
      jobTitle: "Cloud Developer",
      jobDescription: "need a 4+ years of experience in Azure"
    },
    {
      id: "fr5ee3",
      jobTitle: "Quality Testing",
      jobDescription: "need a tester who can test"
    },
  ]

  async function handleCreateJob(jobTitle: string, jobDescription: string) {
      
    const payload = {
      jobTitle,
      jobDescription,
    }

    console.log(payload);
    setOpen(false);
  }

  // const [allJobs, setAllJobs] = useState<Job[]>([]);

  // const getAllJobs = async () => {
  //   const res = await fetch('http://localhost:8080/api/v1/getAllJobs', {
  //     method: 'GET',
  //   })
  //   const resp: Job[] = await res.json();
  //   setAllJobs(resp);
  // }

  // useEffect(() => {
  //   getAllJobs();
  // }, [])

  return (
    <div className=''>
      <h1 className='text-3xl font-semibold my-5'>All Jobs</h1>

      <div className='grid grid-cols-4 gap-4'>
        <div 
          className='flex items-center justify-center p-6 w-full border-[2px] border-dashed shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'
          onClick={() => setOpen(true)}
          >
            <h2 className='flex items-center font-bold'>
            <Plus className='w-10'/> Create New Job
            </h2>
        </div>
        <NewJobModal open={open} setOpen={setOpen} onCreateJob={handleCreateJob} />
        {
          allJobs.map((job) => (
            <div className='p-6 w-full border-[2px] rounded-md border-solid shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'>
              <h3>{job.jobTitle}</h3>
              <h5>{job.jobDescription}</h5>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default AllJobsPage