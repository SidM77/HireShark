import {CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {useEffect, useState} from "react";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";


const PREPARE_TIME = 1;
const ANSWER_TIME = 1;

const questions = {
  1: "What is the most important learning from your experience in backend development?",
  2: "How do you keep yourself up to date with Modern Tech?"
};

function TestRound1() {

  const [phase, setPhase] = useState('name');
  const [name, setName] = useState('');
  const [timer, setTimer] = useState(0);
  const [answers, setAnswers] = useState({ 1: '', 2: '' });
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (timer === 0 && (phase === 'prepare1' || phase === 'prepare2' || phase === 'answer1' || phase === 'answer2')) {
      if (phase === 'answer1' || phase === 'answer2') {
        const questionNumber = phase === 'answer1' ? 1 : 2;
        setAnswers((prev) => ({ ...prev, [questionNumber]: transcript }));
        SpeechRecognition.stopListening();
      }
      handleNextPhase();
    }
    return () => clearInterval(interval);
  }, [timer, phase]);

  const handleNextPhase = () => {
    const phases = {
      'name': 'instructions',
      'instructions': 'prepare1',
      'prepare1': 'answer1',
      'answer1': 'prepare2',
      'prepare2': 'answer2',
      'answer2': 'thank-you'
    };

    if (phase === 'answer1' || phase === 'answer2') {
      const questionNumber = phase === 'answer1' ? 1 : 2;
      setAnswers(prev => {
        const updatedAnswers = { ...prev, [questionNumber]: transcript };
        if (phase === 'answer2') {
          submitResults(updatedAnswers);
        }
        return updatedAnswers;
      });
      SpeechRecognition.stopListening();
    }

    const nextPhase = phases[phase];
    if (nextPhase === 'prepare1' || nextPhase === 'prepare2') {
      setTimer(PREPARE_TIME);
      resetTranscript();
    } else if (nextPhase === 'answer1' || nextPhase === 'answer2') {
      setTimer(ANSWER_TIME);
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    }

    setPhase(nextPhase);
  };

  const submitResults = async (finalAnswers) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/update-answers', {
        method: 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          questions,
          answers: finalAnswers,
        }),
      });
      console.log('Interview submitted:', await response.json());
    } catch (error) {
      console.error('Error submitting results:', error);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="card-container">
        <div className="card">
          <CardContent className="text-center">
            Your browser doesnt support speech recognition.
          </CardContent>
        </div>
      </div>
    );
  }

  const renderPhase = () => {
    if (phase === 'name') {
      return (
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter Email"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
          <Button
            onClick={handleNextPhase}
            disabled={!name.trim()}
            className="button"
          >
            Continue
          </Button>
        </div>
      );
    }

    if (phase === 'instructions') {
      return (
        <div className="space-y-4">
          <p className="text-lg">You will be presented with a question and be given 10 seconds to prepare, the next 10 seconds shall be used to answer the question orally.</p>
          <Button onClick={handleNextPhase} className="button">
            Start Interview
          </Button>
        </div>
      );
    }

    if (phase.startsWith('prepare')) {
      const questionNumber = phase === 'prepare1' ? 1 : 2;
      return (
        <div className="space-y-4">
          <p className="text-lg">Prepare your answer for:</p>
          <p className="text-xl font-semibold">{questions[questionNumber]}</p>
          <p className="text-2xl font-bold">Time remaining: {timer}s</p>
        </div>
      );
    }

    if (phase.startsWith('answer')) {
      const currentQuestion = phase === 'answer1' ? 1 : 2;
      return (
        <div className="space-y-4">
          <p className="text-lg">Now answering:</p>
          <p className="text-xl font-semibold">{questions[currentQuestion]}</p>
          <p className="text-2xl font-bold">Time remaining: {timer}s</p>
          <p className="mt-4 text-green-600">Recording in progress...</p>
        </div>
      );
    }

    if (phase === 'thank-you') {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <p className="mt-4">Your interview has been submitted successfully.</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="card-container">
      <div className="card">
        <CardHeader>
          <CardTitle className="card-title">Interview Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderPhase()}
        </CardContent>
      </div>
    </div>
  );
}

export default TestRound1;