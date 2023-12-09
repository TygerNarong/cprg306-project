"use client";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';


const QuizForm = ({ questions, onSubmit, timeUp }) => {
  const { register, handleSubmit } = useForm();

  return (
    <form className="max-w-md mx-auto my-8 bg-white p-6 rounded-md shadow-md" onSubmit={handleSubmit(onSubmit)}>
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{question}</label>
          <input
            className="mt-1 p-2 border rounded-md w-full text-xl text-blue-500 focus:outline-none focus:ring focus:border-blue-300"
            type="number"
            {...register(`answer${index + 1}`)}
          />
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        disabled={timeUp}
      >
        Submit
      </button>
    </form>
  );
};

const QuizResult = ({ score, totalQuestions }) => {
  const percentage = (score / totalQuestions) * 100;
  let grade;

  if (percentage >= 80) {
    grade = 'A';
  } else if (percentage >= 60) {
    grade = 'B';
  } else if (percentage >= 40) {
    grade = 'C';
  } else {
    grade = 'F';
  }

  return (
    <div className="max-w-md mx-auto my-8 p-4 bg-white rounded-md shadow-md">
      <h2 className="text-2xl text-black font-bold mb-4">Quiz Result</h2>
      <p className="mb-2 text-black">Score: {score}</p>
      <p className="mb-2 text-black">Percentage: {percentage.toFixed(2)}%</p>
      <p className="text-black">Grade: {grade}</p>
    </div>
  );
};

const Home = () => {
  const initialSeconds = 300; // 5 minutes (300 seconds)
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [restartQuiz, setRestartQuiz] = useState(false);

  const questions = [
    'What is 2 + 2?',
    'What is 5 * 3?',
    'What is 8 / 2?',
    'What is 10 - 7?',
    'What is 4 squared?',
  ];

  const handleSubmit = (data) => {
    const correctAnswers = [4, 15, 4, 3, 16];
    const userAnswers = Object.values(data).map(Number);
    const newScore = userAnswers.reduce((acc, answer, index) => {
      return acc + (answer === correctAnswers[index] ? 1 : 0);
    }, 0);

    setScore(newScore);
    setQuizComplete(true);
    setTimeUp(true);
  };

  const handleRestart = () => {
    setQuizComplete(false);
    setScore(0);
    setTimeUp(false);
    setSecondsLeft(initialSeconds);
    setRestartQuiz(true);
  };

  useEffect(() => {
    if (restartQuiz) {
      setRestartQuiz(false);
    } else {
      const timer = setInterval(() => {
        if (secondsLeft > 0 && !quizComplete) {
          setSecondsLeft((prevSeconds) => prevSeconds - 1);
        } else {
          setQuizComplete(true);
          setTimeUp(true);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [secondsLeft, quizComplete, restartQuiz]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        {!quizComplete ? (
          <div>
            <p className="text-lg font-semibold mb-2 text-black">
              Time Left: {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 })}
            </p>
            <QuizForm questions={questions} onSubmit={handleSubmit} timeUp={timeUp} />
          </div>
        ) : (
<div className="flex flex-col items-center">
  <QuizResult score={score} totalQuestions={questions.length} />
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700"
    onClick={handleRestart}
  >
    Restart Quiz
  </button>
</div>

        )}
      </div>
    </div>
  );
};

export default Home;


