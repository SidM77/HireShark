import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Job } from '../AllJobs/AllJobsPage';
import Stepper from '@/components/custom/Stepper';
import Phase1Page from './Phase1/Phase1Page';
import Phase2Page from './Phase2/Phase2Page';
import Phase3Page from './Phase3/Phase3Page';
import Phase4Page from './Phase4/Phase4Page';
import Phase5Page from './Phase5/Phase5Page';
import Phase6Page from './Phase6/Phase6Page';

import { Phase1_Result } from './Phase2/Columns';
import { Phase2_Result } from './Phase3/Columns';
import Navbar from '@/components/custom/Navbar';
import { Phase3_Result } from './Phase4/Columns';
import { Phase4_Result } from './Phase5/Columns';

export interface Phase {
    stepId: number;
    label: string;
}

export interface SpecificJobProcessData extends Job {
    allCandidatesRankingPhase1: Phase1_Result[],
    allOralTestResults: any[],
    allTechTestResults: Phase2_Result[],
    finalCandidateReports: Phase4_Result[],
}

export default function Dashboard() {

    const [currPhase, setCurrPhase] = useState<number>(1);
    const [currJobData, setCurrJobData] = useState<SpecificJobProcessData | null>();
    const [jobDsc, setJobDsc] = useState<string>("");
    const [jobTitle, setJobTitle] = useState<string>("");

    // might need these, not too sure
    const [phase2_InitialData, setPhase2_InitialData] = useState<Phase1_Result[]>([]);
    const [phase3_InitialData, setPhase3_InitialData] = useState<Phase2_Result[]>([]);
    const [phase4_InitialData, setPhase4_InitialData] = useState<Phase3_Result[]>([]);
    const [phase5_InitialData, setPhase5_InitialData] = useState<Phase4_Result[]>([]);

    const location = useLocation();
    let humanReadableJobId = location.state.humanReadableJobId

    const fetchSpecificJobData = async (humanReadableJobId: string) => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/findJobById/${humanReadableJobId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const resp: SpecificJobProcessData = await res.json();

            setCurrJobData(resp);
            setCurrPhase(resp.phase);
            setJobDsc(resp.jobDescription);
            setJobTitle(resp.jobTitle);
            setPhase2_InitialData(resp.allCandidatesRankingPhase1);
            setPhase3_InitialData(resp.allTechTestResults);
            setPhase4_InitialData(resp.allOralTestResults);
            setPhase5_InitialData(resp.finalCandidateReports);

        } catch (error) {
            console.error("Failed to fetch job data:", error);
        }
    }

    // phase1 result return function
    const Phase1_Submission = async () => {
        // placing this above api call so that we can display next phase,
        // initially it will have an empty table, which would then show rows
        // when data is fetched from the below endpoint
        // updating currStep
        setCurrPhase(currPhase + 1);

        // submitting the resumes to DeepSeek

        // Taking DeepSeek's response and setting it to phase2InitialData
        // in this, there should be a body sent having the humanReadableJobId?
        const res = await fetch('http://localhost:8080/api/v1/nextPhase/phase1Dummy', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })

        // Enable this when we are connected to ritik's server
        // let body = {
        //     jobId: currJobData?.humanReadableJobId,
        // }
        
        // const res = await fetch('http://192.168.45.255:5001/analyzeResumes', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json'
        //     },
        //     body: JSON.stringify(body)
        // })
        const resp: Phase1_Result[] = await res.json()
        setPhase2_InitialData(resp);
    }

    //phase2 result return function
    const Phase_Submission = async () => {
        // still need to work out the data transfer part

        setCurrPhase(currPhase + 1);
    }

    useEffect(() => {
        fetchSpecificJobData(humanReadableJobId);
    }, []);

    const phaseInfo: Phase[] = [
        {
            stepId: 1,
            label: "AI Ranking of Candidates"
        },
        {
            stepId: 2,
            label: "Send Link for Round 1"
        },
        {
            stepId: 3,
            label: "Send Link for Round 2"
        },
        {
            stepId: 4,
            label: "Send Link for Interview"
        },
        {
            stepId: 5,
            label: "Send Offer Letter"
        },
        {
            stepId: 6,
            label: "Hiring Completion!"
        }
    ]

    const renderPhaseComponent = () => {
        switch (currPhase) {
            case 1:
                return <Phase1Page jobId={humanReadableJobId} onSubmission={Phase1_Submission} />;
            case 2:
                return <Phase2Page jobId={humanReadableJobId} Phase1_Result_data={phase2_InitialData} onSubmission={Phase_Submission} />;
            case 3:
                return <Phase3Page jobId={humanReadableJobId} Phase2_Result_data={phase3_InitialData} onSubmission={Phase_Submission} />;
            case 4:
                return <Phase4Page jobId={humanReadableJobId} jobTitle={jobTitle} jobDsc={jobDsc} Phase3_Result_data={phase4_InitialData} onSubmission={Phase_Submission} />;
            case 5:
                return <Phase5Page jobId={humanReadableJobId} Phase4_Result_data={phase5_InitialData} onSubmission={Phase_Submission} />;
            case 6:
                return <Phase6Page jobId={humanReadableJobId} jobTitle={jobTitle} onSubmission={Phase_Submission} />
        }
    }


    return (
        <div className="flex flex-col items-center">
            <Navbar />
            <div className="bg-white px-6 pt-10 pb-4 rounded-2xl shadow-md border w-5/6 mb-6">
                <p className="text-3xl font-bold text-gray-800">{currJobData?.jobTitle}</p>
                <p className="text-md font-medium text-gray-500">Job ID: {humanReadableJobId}</p>
            </div>


            <div className='mb-5 w-5/6'>
                <Stepper currentStep={currPhase} numberOfSteps={6} phaseInfo={phaseInfo} />
            </div>

            <div>
                {renderPhaseComponent()}
            </div>

        </div>
    )
}