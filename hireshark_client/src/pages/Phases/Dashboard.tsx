import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { Job } from '../AllJobs/AllJobsPage';
import Stepper from '@/components/custom/Stepper';
import Phase1Page from './Phase1/Phase1Page';
import Phase2Page from './Phase2/Phase2Page';

export interface Phase {
    stepId: number;
    label: string;
}

export default function Dashboard() {

    const location = useLocation();
    let humanReadableJobId = location.state.humanReadableJobId

    const fetchSpecificJobData = async (humanReadableJobId: string) => {

        const res = await fetch(`http://localhost:8080/api/v1/findJobById/${humanReadableJobId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const resp: Job = await res.json();
        console.log(resp)
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

    let currentPhase: number = 1;
    const renderPhaseComponent = () => {
        switch(currentPhase) {
            case 1:
                return <Phase1Page />;
            case 2: 
                return <Phase2Page />;
        }
    }
    

    return (
        <div className="">

            <div className='mb-5'>
                <Stepper currentStep={1} numberOfSteps={4} phaseInfo={phaseInfo} />
            </div>

            <div>
                {renderPhaseComponent()}
            </div>
            
        </div>
    )
}