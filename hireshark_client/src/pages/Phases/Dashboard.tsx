import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Job } from '../AllJobs/AllJobsPage';
import Stepper from '@/components/custom/Stepper';
import Phase1Page from './Phase1/Phase1Page';
import Phase2Page from './Phase2/Phase2Page';

import { Phase1_Result } from './Phase2/Columns';

export interface Phase {
    stepId: number;
    label: string;
}

export default function Dashboard() {

    const [currPhase, setCurrPhase] = useState<number>(1);

    // might need these, not too sure
    const [phase2_InitialData, setPhase2_InitialData] = useState<Phase1_Result[]>([]);
    const [phase3_InitialData, setPhase3_InitialData] = useState([]);
    const [phase4_InitialData, setPhase4_InitialData] = useState([]);

    const location = useLocation();
    let humanReadableJobId = location.state.humanReadableJobId

    const fetchSpecificJobData = async (humanReadableJobId: string) => {

        const res = await fetch(`http://localhost:8080/api/v1/findJobById/${humanReadableJobId}`, {
            method: 'GET',
            // headers: {
            //     'Content-Type': 'application/json',
            // }
        })

        const resp: Job = await res.json();
        // console.log(resp)
    }

    // phase1 result return function
    const Phase1_Submission = async () => {
        // submitting the resumes to DeepSeek
        // Taking DeepSeek's response and setting it to phase2InitialData
        const res = await fetch('http://localhost:8080/api/v1/nextPhase/phase1Dummy', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        const resp: Phase1_Result[] = await res.json()
        setPhase2_InitialData(resp);
        
        // updating currStep
        setCurrPhase(currPhase+1);
    }

    //phase2 result return function
    const Phase2_Submission = async () => {
        
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
            }
        ]

    const renderPhaseComponent = () => {
        switch(currPhase) {
            case 1:
                return <Phase1Page onSubmission={Phase1_Submission} />;
            case 2: 
                return <Phase2Page Phase1_Result_data={phase2_InitialData}/>;
        }
    }
    

    return (
        <div className="">

            <div className='mb-5'>
                <Stepper currentStep={currPhase} numberOfSteps={4} phaseInfo={phaseInfo} />
            </div>

            <div>
                {renderPhaseComponent()}
            </div>
            
        </div>
    )
}