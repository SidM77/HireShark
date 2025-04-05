import React from "react";
import { Phase } from "@/pages/UploadResumesToJD/Dashboard";

type StepperProps = {
    currentStep: number;
    numberOfSteps: number;
    phaseInfo: Phase[];
};

function Stepper({ currentStep, numberOfSteps, phaseInfo }: StepperProps) {

    const activeColourBar = (index: number) => currentStep > index + 1 ? "bg-blue-500" : "bg-gray-300";

    const activeColourCircle = (index: number) => {
        if(currentStep==index+1) return "ring-4 ring-blue-500 bg-gray-300"
        else if(currentStep>index+1) return "bg-blue-500"
        else return "bg-gray-300"
    }

    const isFinalStep = (index: number) => index === numberOfSteps - 1;
    return (
        <div className="flex flex-col items-center">

            <div className="flex flex-row justify-between w-full items-center">
                {phaseInfo.map((_, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center">
                            <div className={`rounded-full ${activeColourCircle(index)} w-10 h-10`}></div>
                        </div>

                        {!isFinalStep(index) && (
                            <div className={`h-1 flex-1 ${activeColourBar(index)}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="flex flex-row justify-between w-full mt-2">
                {phaseInfo.map((phase, index) => (
                    <div className="w-10 text-center" key={index}>
                        <p className="text-xs">{phase.label}</p>
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default Stepper