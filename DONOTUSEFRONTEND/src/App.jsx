import MainTest from "@/MainTest.jsx";
import {Routes, Router, Route} from "react-router-dom";
import {LucideScissorsSquareDashedBottom} from "lucide-react";

const App = () => {
  // const [phase, setPhase] = useState('name'); // name, instructions, prepare1, answer1, prepare2, answer2, thank-you
  // const [name, setName] = useState('');
  // const [timer, setTimer] = useState(0);
  // const [answers, setAnswers] = useState({ 1: '', 2: '' });
  // const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  //
  // useEffect(() => {
  //   let interval;
  //   if ((phase === 'prepare1' || phase === 'prepare2') && timer > 0) {
  //     interval = setInterval(() => setTimer(t => t - 1), 1000);
  //   } else if ((phase === 'answer1' || phase === 'answer2') && timer > 0) {
  //     interval = setInterval(() => setTimer(t => t - 1), 1000);
  //   } else if ((phase === 'answer1' || phase === 'answer2') && timer === 0) {
  //     const questionNumber = phase === 'answer1' ? 1 : 2;
  //     setAnswers(prev => ({ ...prev, [questionNumber]: transcript }));
  //     handleNextPhase();
  //   }
  //   return () => clearInterval(interval);
  // }, [phase, timer, transcript]);
  //
  // const handleNextPhase = () => {
  //   const phases = {
  //     'name': 'instructions',
  //     'instructions': 'prepare1',
  //     'prepare1': 'answer1',
  //     'answer1': 'prepare2',
  //     'prepare2': 'answer2',
  //     'answer2': 'thank-you'
  //   };
  //
  //   if (phase === 'answer1' || phase === 'answer2') {
  //     SpeechRecognition.stopListening();
  //   }
  //
  //   if (phases[phase] === 'prepare1' || phases[phase] === 'prepare2') {
  //     setTimer(PREPARE_TIME);
  //     resetTranscript();
  //   } else if (phases[phase] === 'answer1' || phases[phase] === 'answer2') {
  //     setTimer(ANSWER_TIME);
  //     resetTranscript();
  //     SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  //   } else if (phases[phase] === 'thank-you') {
  //     // Make API call with the results
  //     submitResults();
  //   }
  //
  //   setPhase(phases[phase]);
  // };
  //
  // const submitResults = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5000/process-audio', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         name,
  //         questions,
  //         answers,
  //       }),
  //     });
  //     // Handle response if needed
  //   } catch (error) {
  //     console.error('Error submitting results:', error);
  //   }
  // };
  //
  // if (!browserSupportsSpeechRecognition) {
  //   return (
  //     <Card className="w-full max-w-md mx-auto mt-8">
  //       <CardContent className="p-6">
  //         Your browser does not support speech recognition.
  //       </CardContent>
  //     </Card>
  //   );
  // }
  //
  // const renderPhase = () => {
  //   switch (phase) {
  //     case 'name':
  //       return (
  //         <div className="space-y-4">
  //           <Input
  //             type="text"
  //             placeholder="Enter your name"
  //             value={name}
  //             onChange={(e) => setName(e.target.value)}
  //             className="w-full"
  //           />
  //           <Button
  //             onClick={handleNextPhase}
  //             disabled={!name.trim()}
  //             className="w-full"
  //           >
  //             Continue
  //           </Button>
  //         </div>
  //       );
  //
  //     case 'instructions':
  //       return (
  //         <div className="space-y-4">
  //           <p className="text-lg">Instructions will go here</p>
  //           <Button onClick={handleNextPhase} className="w-full">
  //             Start Interview
  //           </Button>
  //         </div>
  //       );
  //
  //     case 'prepare1':
  //     case 'prepare2':
  //       { const questionNumber = phase === 'prepare1' ? 1 : 2;
  //       return (
  //         <div className="space-y-4">
  //           <p className="text-lg">Prepare your answer for:</p>
  //           <p className="text-xl font-semibold">{questions[questionNumber]}</p>
  //           <p className="text-2xl font-bold">Time remaining: {timer}s</p>
  //         </div>
  //       ); }
  //
  //     case 'answer1':
  //     case 'answer2':
  //       { const currentQuestion = phase === 'answer1' ? 1 : 2;
  //       return (
  //         <div className="space-y-4">
  //           <p className="text-lg">Now answering:</p>
  //           <p className="text-xl font-semibold">{questions[currentQuestion]}</p>
  //           <p className="text-2xl font-bold">Time remaining: {timer}s</p>
  //         </div>
  //       ); }
  //
  //     case 'thank-you':
  //       return (
  //         <div className="text-center">
  //           <h2 className="text-2xl font-bold">Thank You!</h2>
  //           <p className="mt-4">Your interview has been submitted successfully.</p>
  //         </div>
  //       );
  //
  //     default:
  //       return null;
  //   }
  // };

  return (
    // <Card className="w-full max-w-2xl mx-auto mt-8">
    //   <CardHeader>
    //     <CardTitle className="text-center">Interview Session</CardTitle>
    //   </CardHeader>
    //   <CardContent className="p-6">
    //     {renderPhase()}
    //   </CardContent>
    // </Card>
    <Router>
      <Routes>

        {/*<Route path="/admin-dashboard" element={<LucideScissorsSquareDashedBottom />} />*/}
        {/*<Route path="/round1/:someString" element={<MainTest />} />*/}
      </Routes>
    </Router>
  );
};

export default App;