import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const CandidateReportForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [techKnowledge, setTechKnowledge] = useState<number>(0);
  const [communication, setCommunication] = useState<number>(0);
  const [problemSolving, setProblemSolving] = useState<number>(0);
  const [comments, setComments] = useState<string>('');

  const email = searchParams.get('email') || '';
  const jobId = searchParams.get('jobId') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email,
      jobId,
      techKnowledge,
      communication,
      problemSolving,
      comments,
    };

    console.log(payload);

    try {
      const response = await fetch('http://localhost:8080/api/v1/addCandidateReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      alert('Report submitted successfully!');
    } catch (error) {
      alert('Error submitting report');
      console.error(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-gray-100 rounded-lg shadow-md font-sans">
      <h2 className="text-2xl font-semibold text-center mb-6">Candidate Report Form</h2>
      
      <div className="text-sm text-gray-600 mb-4">
        <strong>Email:</strong> {email}
      </div>
      <div className="text-sm text-gray-600 mb-6">
        <strong>Job ID:</strong> {jobId}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block font-semibold mb-2">Technical Knowledge:</label>
          <input
            type="number"
            value={techKnowledge}
            onChange={(e) => setTechKnowledge(Number(e.target.value))}
            className="w-full p-3 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            min={0}
            max={10}
          />
        </div>

        <div className="mb-5">
          <label className="block font-semibold mb-2">Communication:</label>
          <input
            type="number"
            value={communication}
            onChange={(e) => setCommunication(Number(e.target.value))}
            className="w-full p-3 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            min={0}
            max={10}
          />
        </div>

        <div className="mb-5">
          <label className="block font-semibold mb-2">Problem Solving:</label>
          <input
            type="number"
            value={problemSolving}
            onChange={(e) => setProblemSolving(Number(e.target.value))}
            className="w-full p-3 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            min={0}
            max={10}
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Comments:</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full p-3 bg-white border border-gray-300 rounded-md text-sm resize-vertical min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CandidateReportForm;
