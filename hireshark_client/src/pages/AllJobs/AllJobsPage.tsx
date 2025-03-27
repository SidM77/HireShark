import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react'
import NewJobModal from './NewJobModal';
import { Candidate } from '../Scratch/Columns';

export interface Job extends Candidate {
  humanReadableJobId: string;
  jobTitle: string;
  jobDescription: string;
  candidates: Array<Candidate>;
  isOpen: boolean;
  id: any;
}

function AllJobsPage() {

  const [open, setOpen] = useState<boolean>(false);
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  let navigate = useNavigate();

  const getAllJobs = async () => {
    const res = await fetch('http://localhost:8080/api/v1/getAllJobs', {
      method: 'GET',
    })
    const resp: Job[] = await res.json();
    setAllJobs(resp);
    console.log(resp)
  }

  const createNewJob = async (jobTitle: string, jobDescription: string) => {
    let body = {
      humanReadableJobId: "",
      jobTitle: jobTitle,
      jobDescription: jobDescription,
      candidates: [],
    }

    const res = await fetch('http://localhost:8080/api/v1/createNewJob', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }) 

    console.log(res);
    setOpen(false);
  }

  // dummy data for the jobs.
  // const allJobs = [
  //   {
  //     id: "abc123",
  //     jobTitle: "SDE-1 Fresher",
  //     jobDescription: "need a good fresher knowing java framework",
  //     active: true,
  //   },
  //   {
  //     id: "er4a23",
  //     jobTitle: "Cloud Developer Soap Developer Java Backend",
  //     jobDescription: "need a 4+ years of experience in Azure. Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet consectetur exercitationem architecto illo, inventore laboriosam nisi veniam totam accusamus repudiandae, quidem esse cumque eos vero aliquam commodi quisquam nobis quis?",
  //     active: true,
  //   },
  //   {
  //     id: "fr5ee3",
  //     jobTitle: "Quality Testing",
  //     jobDescription: "need a tester who can test",
  //     active: false,
  //   },
  // ]

  // function to create job, for now only has jobtitle and jd,
  // but once we get jobs data, we will create an array of emails
  // emails will be sent in the payload.

  useEffect(() => {
    getAllJobs();
  }, [])

  return (
    <div className=''>
      <h1 className='text-3xl font-semibold my-5'>All Jobs</h1>
      {
        allJobs.length == 0 &&
        (
          <div>
            No jobs opened!
          </div>
        )
      }
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        {/*
          this div is a button to open modal for creating new job.
          so the POST new job api is to be used for this
          !!remaining - want to add a toast to confirm the submission of new job
                        do it once api is integrated.
        */}
        <div
          className='flex items-center justify-center p-6 w-full h-[280px] border-[3px] border-dashed rounded-md shadow-lg
            hover:bg-gray-100 hover:cursor-pointer active:inset-0 active:shadow-inner transition-all duration-150'
          onClick={() => setOpen(true)}
        >
          <p className='flex items-center text-xl font-bold'>
            <Plus className='w-10' /> Create New Job
          </p>
        </div>
        <NewJobModal open={open} setOpen={setOpen} onCreateJob={createNewJob} />
        {/*
          this would be a list of existing jobs.
          if you have time, create delete job as well? but not a priority
          also send jobs based on how recently they are created from backend.
          
          !!remaining - clicking on this jobs should open a dashboard for the respective job
        */}
        {
          allJobs.length > 0 && (
            allJobs.map((job) => (
              <div className='flex flex-col justify-between gap-2 px-5 py-3 w-full h-[280px] border-[2px] rounded-md border-solid shadow-lg
                hover:bg-gray-100 hover:cursor-pointer active:inset-0 active:shadow-inner transition-all duration-150'
                onClick={() => {
                  navigate('/jobs/selection', {
                    state: {humanReadableJobId: job.humanReadableJobId}
                  });
                }}
                >
                
                <div className='flex flex-col items-start gap-1'>
                  <div className='w-full flex items-start justify-between gap-3'>
                    <div className='text-left text-2xl line-clamp-2 font-semibold text-green-600'>{job.jobTitle}</div>
                    <div>{job.isOpen ? <div className='bg-green-400 p-1 rounded-md text-sm text-white shadow-md'>Open</div> : <div className='bg-red-400 p-1 rounded-md text-sm text-white shadow-md'>Closed</div>}</div>
                  </div>
                  <div className='flex items-start'>
                    <p><span className='font-bold'>Job ID:</span> {job.humanReadableJobId}</p>
                  </div>
                </div>

                <div className='flex flex-col flex-grow max-h-[150px] overflow-auto'>
                  <div className='flex items-start'>
                    <p className='font-bold'>Job Description:</p>
                  </div>
                  <div className='flex flex-col items-start overflow-y-auto no-scrollbar'>
                    <p className='text-sm text-left text-pretty'>{job.jobDescription}</p>
                  </div>
                </div>

                <div className='flex items-start mt-auto'>
                  <p><span className='font-bold text-sm'>Date of Posting:</span> {new Date(job.id.date).toLocaleDateString()}</p>
                </div>
                
              </div>
            ))
          )
        }
      </div>
    </div>
  )
}

export default AllJobsPage