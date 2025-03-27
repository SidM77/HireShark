import React from "react";

type StepperProps = {
    currentStep: number;
    numberOfSteps: number;
  };

function Stepper({currentStep, numberOfSteps}: StepperProps) {

    const activeColour = (index: number) => currentStep >= index+1 ? "bg-blue-500" : "bg-gray-300";

    const isFinalStep = (index: number) => index === numberOfSteps-1;
  return (
    <div className="flex items-center">
        {
            Array.from({length: numberOfSteps}).map((_, index) => 
                (
                    <React.Fragment key={index}>
                        <div className={`rounded-full ${activeColour(index)} w-6 h-6`}></div>
                        {isFinalStep(index) ? 
                            null : 
                            <span className={`h-1 w-12 ${activeColour(index)}`}></span>
                        }
                    </React.Fragment>
                )
            )
        }
    </div>
  )
}

export default Stepper