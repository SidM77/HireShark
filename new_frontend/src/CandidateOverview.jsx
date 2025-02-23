import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, FileText } from "lucide-react";

const CandidateOverview = () => {
  // Sample data
  const candidates = [
    {
      "id": {
        "timestamp": 1740131241,
        "date": "2025-02-21T09:47:21.000+00:00"
      },
      "date": "2025-02-21T09:47:01Z",
      "file_path": null,
      "pdfFile": null,
      "pdfFilename": "Siddanth_Manoj_2024_L.pdf",
      "senderEmail": "siddanth.manoj@gmail.com",
      "subject": "i want a job as software engineer",
      "questions": {
        "1": "What is the most important learning from your experience in backend development?",
        "2": "How do you keep yourself up to date with Modern Tech?"
      },
      "answers": {
        "1": "hello hello hello hi how are you",
        "2": "yes yes"
      },
      "technicalTestScore": 7
    },
    {
      "id": {
        "timestamp": 1740159500,
        "date": "2025-02-21T17:38:20.000+00:00"
      },
      "date": "2025-02-21T17:37:17Z",
      "file_path": null,
      "pdfFile": null,
      "pdfFilename": "Krish_Manghani_Resume_.pdf",
      "senderEmail": "krishmanghani@gmail.com",
      "subject": "Application for Backend Development Role",
      "questions": {
        "1": "What is the most important learning from your experience in backend development?",
        "2": "How do you keep yourself up to date with Modern Tech?"
      },
      "answers": {
        "1": "hello testing testing hello hello",
        "2": "hello Instagram"
      },
      "technicalTestScore": 0
    }
  ];

  const handleViewQA = (questions, answers) => {
    // Open questions and answers in new tab
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

  const handleAssignTest = (email) => {
    console.log(`Assigning test to ${email}`);
    // Add your test assignment logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="w-40"></div> {/* Space for balance */}
          <img src="/logo.png" alt="Company Logo" className="h-8" />
          <div className="w-40"></div> {/* Space for balance */}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Candidate Overview</h1>

        <div className="space-y-4">
          {candidates.map((candidate) => (
            <Card key={candidate.id.timestamp} className="w-full">
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
                      onClick={() => handleAssignTest(candidate.senderEmail)}
                    >
                      Assign Test
                    </Button>
                  )}
                </div>

                {/* View Q&A Button */}
                <Button
                  variant="ghost"
                  onClick={() => handleViewQA(candidate.questions, candidate.answers)}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Q&A
                </Button>

                {/* View Resume Button */}
                <Button
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View Resume
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CandidateOverview;