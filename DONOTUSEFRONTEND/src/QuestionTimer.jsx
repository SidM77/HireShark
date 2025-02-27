import {useState, useRef, useEffect} from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";



const InterviewRecorder = () => {
  const [currentState, setCurrentState] = useState({
    phase: "start", // start, prep, recording, complete
    questionIndex: 0,
    timer: 0,
    isRecording: false
  });

  const audioChunks = useRef([]);
  const mediaRecorder = useRef(null);
  const timerRef = useRef(null);

  const questions = [
    "What motivates you to work?",
    "How do you handle challenges?",
  ];

  const startTimer = (seconds, onComplete) => {
    clearInterval(timerRef.current);

    setCurrentState(prev => ({ ...prev, timer: seconds }));

    timerRef.current = setInterval(() => {
      setCurrentState(prev => {
        if (prev.timer <= 1) {
          clearInterval(timerRef.current);
          onComplete();
          return { ...prev, timer: 0 };
        }
        return { ...prev, timer: prev.timer - 1 };
      });
    }, 1000);
  };

  const startPrep = () => {
    setCurrentState(prev => ({ ...prev, phase: "prep" }));
    startTimer(5, startRecordingPhase); // 5 seconds for testing
  };

  const startRecordingPhase = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 44100
        }
      });

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      });

      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.start(100); // Collect data every 100ms

      setCurrentState(prev => ({
        ...prev,
        phase: "recording",
        isRecording: true
      }));

      startTimer(10, () => { // 10 seconds for testing
        stopRecording(stream);
      });

    } catch (error) {
      console.error("Microphone error:", error);
      alert("Error accessing microphone. Please ensure microphone permissions are granted.");
    }
  };

  const stopRecording = (stream) => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      stream.getTracks().forEach(track => track.stop());

      mediaRecorder.current.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks.current, {
            type: 'audio/webm;codecs=opus'
          });

          // For debugging - create a downloadable link
          const audioUrl = URL.createObjectURL(audioBlob);
          const a = document.createElement('a');
          a.href = audioUrl;
          a.download = `response_${currentState.questionIndex + 1}.webm`;
          a.click();
          URL.revokeObjectURL(audioUrl);

          const formData = new FormData();
          formData.append("file", audioBlob, `response_${currentState.questionIndex + 1}.webm`);

          const response = await fetch("http://localhost:5000/process-audio", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Server error');
          }

          if (currentState.questionIndex < questions.length - 1) {
            setCurrentState(prev => ({
              ...prev,
              questionIndex: prev.questionIndex + 1,
              phase: "prep",
              isRecording: false
            }));
            startPrep();
          } else {
            setCurrentState(prev => ({
              ...prev,
              phase: "complete",
              isRecording: false
            }));
          }
        } catch (error) {
          console.error("Error sending audio:", error);
          alert(`Error sending audio to server: ${error.message}`);
        }
      };
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  if (currentState.phase === "complete") {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="text-center p-6">
          <h2 className="text-2xl font-bold mb-4">Thank you for completing the interview!</h2>
          <p className="text-gray-600">Your responses have been recorded.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center">
      {currentState.phase === "start" ? (
        <Button onClick={startPrep} className="mb-4">
          Start Interview
        </Button>
      ) : (
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-bold mb-2">
              {currentState.phase === "prep" ? "Prepare your answer" : "Recording your answer"}
            </h2>
            <p className="text-gray-700 mb-4">
              Question {currentState.questionIndex + 1} of {questions.length}:
              <br />
              {questions[currentState.questionIndex]}
            </p>
            <p className="text-2xl font-mono mb-2">{currentState.timer}s</p>
            {currentState.isRecording && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <p className="text-sm text-red-500">Recording...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InterviewRecorder;
