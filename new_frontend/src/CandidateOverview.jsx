import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {ExternalLink, FileText, XCircle} from "lucide-react";
import Logo from "@/assets/logo.png"
// import { Skeleton } from "@/components/ui/skeleton";

const CandidateOverview = () => {
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/getInfoWithoutResumePDF');
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      const data = await response.json();
      setCandidates(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleViewQA = (questions, answers) => {
    const qaWindow = window.open('', '_blank');
    qaWindow.document.write(`
      <html>
        <head><title>Questions & Answers</title></head>
        <body>
          <h2>Questions & Answers</h2>
          ${Object.entries(questions).map(([key, question]) => `
            <div style="margin-bottom: 20px;">
              <p><strong>Q${key}:</strong> ${question}</p>
              <p><strong>A${key}:</strong> ${answers[key]}</p>
            </div>
          `).join('')}
        </body>
      </html>
    `);
  };

  const handleViewPDF = (candidateEmail) => {
    // Open PDF in new tab
    window.open(`http://localhost:8080/api/v1/getPDF/${candidateEmail}`, '_blank');
  };

  const hasValidQA = (candidate) => {
    return candidate.questions &&
      candidate.answers &&
      Object.keys(candidate.questions).length > 0 &&
      Object.keys(candidate.answers).length > 0;
  };

  const handleAssignTest = async (email, id) => {
    console.log(`Assigning test to ${email} and ${id}`);
    const response = await fetch(`http://localhost:8080/api/v1/sendSingleTestLink`, {
      method: 'POST',
      headers: {
        "Accept": "*/*"
      }
    });
    console.log(response.status);

  };

  //NEEDS TO BE MODIFIED TO ADD TECHNICAL TEST, CURRENTLY SENDS QA TEST
  const handleAssignTechnicalTest = async (email, id) => {
    console.log(`Assigning technical test to ${email} and ${id}`);
    //THIS IS NOT INTENDED DO NOT USE
    // const response = await fetch(`http://localhost:8081/api/tests/assignTest?email=${encodeURIComponent(email)}&id=${encodeURIComponent(id)}`, {
    //   method: 'GET',
    //   headers: {
    //     "Accept": "*/*"
    //   }
    // });
    // console.log(response.status);

  };

  // Loading skeleton component
  // const LoadingSkeleton = () => (
  //   <Card className="w-full">
  //     <CardContent className="flex items-center justify-between p-6">
  //       <Skeleton className="h-6 w-1/4" />
  //       <Skeleton className="h-8 w-24" />
  //       <Skeleton className="h-8 w-24" />
  //       <Skeleton className="h-8 w-24" />
  //     </CardContent>
  //   </Card>
  // );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className=" mx-auto px-4 h-16 flex items-center justify-between">
          <div className="w-40"></div>
          <img src={Logo} alt="HireShark" className="w-1.5" />
          <div className="w-40"></div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Candidate Overview</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <>
              {/*<LoadingSkeleton />*/}
              {/*<LoadingSkeleton />*/}
              {/*<LoadingSkeleton />*/}
            </>
          ) : (
            candidates.map((candidate, index) => (
              <Card
                key={candidate.id.timestamp}
                className={`w-full transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-blue-500'}`}
              >
                <CardContent className="flex items-center justify-between p-6">
                  {/* Email */}
                  <div className="flex-shrink-0 w-1/4">
                    <p className="text-sm font-medium">{candidate.senderEmail}</p>
                  </div>

                  {/* Technical Score or Assign Test */}
                  <div className="flex-shrink-0">
                    {candidate.technicalTestScore > 0 ? (
                      <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md">
                        Score: {candidate.technicalTestScore}/10
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => handleAssignTechnicalTest(candidate.senderEmail, candidate.id.timestamp)}
                      >
                        Assign Technical Test
                      </Button>
                    )}
                  </div>

                  {/* View Q&A Button */}
                  {hasValidQA(candidate) ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleViewQA(candidate.questions, candidate.answers)}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Q&A
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 text-gray-500 cursor-not-allowed"
                      onClick={() => handleAssignTest(candidate.senderEmail, candidate.id.timestamp)}
                    >
                      <XCircle className="h-4 w-4" />
                      Assign Oral Test
                    </Button>
                  )}

                  {/* View Resume Button */}
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2"
                    onClick={() => handleViewPDF(candidate.senderEmail)}
                  >
                    <FileText className="h-4 w-4" />
                    View Resume
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default CandidateOverview;