import { useState, useEffect } from "react";

const questions = [
  "Tell us about yourself.",
  "Describe a challenge you faced.",
  "What are your strengths and weaknesses?",
];

export default function Interview() {
  const [step, setStep] = useState(0);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    let timer;
    if (recording) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            stopRecording();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (step < questions.length) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            startRecording();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [recording, step]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data]);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error("Microphone access denied", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        sendAudio(audioBlob);
        setAudioChunks([]);
      };
    }
    setRecording(false);
  };

  const sendAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "response.wav");
    await fetch("http://127.0.0.1:5000/transcribe", {
      method: "POST",
      body: formData,
    });
    setStep((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col items-center p-4">
      {step < questions.length ? (
        <>
          <h1 className="text-xl font-bold">{questions[step]}</h1>
          <p className="mt-4">{recording ? "Answer now!" : "Prepare..."}</p>
          <p className="text-lg mt-2">Time left: {timeLeft}s</p>
          {!recording && step === 0 && (
            <button
              className="mt-4 p-2 bg-blue-500 text-white rounded"
              onClick={() => setTimeLeft(10)}
            >
              Start
            </button>
          )}
        </>
      ) : (
        <h1 className="text-xl font-bold">Thank you for participating!</h1>
      )}
    </div>
  );
}
