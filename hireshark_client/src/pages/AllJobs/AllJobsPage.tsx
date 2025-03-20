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

  // dummy data for the jobs.
  const allJobs = [
    {
      id: "abc123",
      jobTitle: "SDE-1 Fresher",
      jobDescription: "need a good fresher knowing java framework",
      active: true,
    },
    {
      id: "er4a23",
      jobTitle: "Cloud Developer Soap Developer Java Backend",
      jobDescription: "need a 4+ years of experience in Azure. Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet consectetur exercitationem architecto illo, inventore laboriosam nisi veniam totam accusamus repudiandae, quidem esse cumque eos vero aliquam commodi quisquam nobis quis?",
      active: true,
    },
    {
      id: "fr5ee3",
      jobTitle: "Quality Testing",
      jobDescription: "need a tester who can test",
      active: false,
    },
  ]

  // function to create job, for now only has jobtitle and jd,
  // but once we get jobs data, we will create an array of emails
  // emails will be sent in the payload.
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

      <div className='grid grid-cols-3 gap-4'>
        {/*
          this div is a button to open modal for creating new job.
          so the POST new job api is to be used for this
          !!remaining - want to add a toast to confirm the submission of new job
                        do it once api is integrated.
        */}
        <div 
          className='flex items-center justify-center p-6 w-full border-[3px] border-dashed rounded-md shadow-lg
            hover:bg-gray-100 hover:cursor-pointer active:inset-0 active:shadow-inner transition-all duration-150'
          onClick={() => setOpen(true)}
          >
            <p className='flex items-center text-xl font-bold'>
            <Plus className='w-10'/> Create New Job
            </p>
        </div>
        <NewJobModal open={open} setOpen={setOpen} onCreateJob={handleCreateJob} />
        {/*
          this would be a list of existing jobs.
          if you have time, create delete job as well? but not a priority
          also send jobs based on how recently they are created from backend.
          
          !!remaining - clicking on this jobs should open a dashboard for the respective job
        */}
        {
          allJobs.map((job) => (
            <div className='flex flex-col gap-4 p-6 w-full h-[230px] border-[2px] rounded-md border-solid shadow-lg'>
              <div className='flex items-center justify-between'>
                <div className='text-left text-xl line-clamp-2 font-semibold'>{job.jobTitle}</div>
                <div>{job.active ? <div className='bg-green-400 p-1 rounded-md text-sm text-white'>Open</div> : <div className='bg-red-400 p-1 rounded-md text-sm text-white'>Closed</div>}</div>
              </div>
              <div className='overflow-y-auto no-scrollbar h-[150px]'>
                <p className='text-sm text-left text-pretty'>{job.jobDescription}</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default AllJobsPage