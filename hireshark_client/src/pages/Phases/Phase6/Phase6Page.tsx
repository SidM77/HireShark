import { useState } from "react";
import { Button } from "@/components/ui/button"

type Phase6PageProps = {
  jobId: string;
  jobTitle: string;
  onSubmission: () => void;
}

function Phase6Page({ jobId, jobTitle, onSubmission }: Phase6PageProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCloseJob = async () => {
    setShowConfirm(false)
    // try {
    //   setLoading(true);

    //   const response = await fetch(`http://localhost:8080/api/v1/closeJob/${jobId}`, {
    //     method: 'PATCH',
    //   });

    //   if (!response.ok) {
    //     throw new Error('Failed to close job');
    //   }

    //   alert('Job closed successfully!');
    //   onSubmission();
    // } catch (error) {
    //   console.error(error);
    //   alert('Something went wrong while closing the job.');
    // } finally {
    //   setLoading(false);
    //   setShowConfirm(false);
    // }
  };


  return (
    <div className="flex flex-col items-center justify-center m-2">
      <h1 className="text-5xl font-extrabold text-purple-700 mb-4 animate-bounce">
        Congratulations!
      </h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        You have successfully completed the hiring process for
      </h2>
      <p className="text-xl text-gray-700 mb-10 text-center">
        <span className="font-bold">{jobId}</span> - {jobTitle}
      </p>

      <Button
        className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-xl text-lg"
        onClick={() => setShowConfirm(true)}
      >
        Close Job
      </Button>

      {/* Manual Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2 text-center">Confirm Close Job</h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to close this job? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-400 text-gray-600 hover:bg-gray-100"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleCloseJob}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Closing..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}

export default Phase6Page