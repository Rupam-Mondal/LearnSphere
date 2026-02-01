import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import axios from "axios";

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseTitle, courseId } = location.state || {};
  const { user } = useContext(UserContext);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [aiQuestions, setAiQuestions] = useState([]);
  const [loader, setLoader] = useState(false);
  const [ansLoader, setAnsLoader] = useState(false);

  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAIQuestions = async () => {
      setLoader(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/ai/quiz?topic=${courseTitle}`
        );
        setAiQuestions(res.data.quiz || []);
      } catch (err) {
        console.error("Error fetching quiz");
      } finally {
        setLoader(false);
      }
    };

    fetchAIQuestions();
  }, [courseTitle]);

  const checkAnswers = async (finalAnswers) => {
    setAnsLoader(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ai/quiz/check`,
        {
          questionList: aiQuestions,
          userAnswersList: finalAnswers,
        }
      );

      setScore(res.data.score); 
      setResult(res.data.result);
      setShowResult(true);
    } catch (err) {
      console.error("Error checking answers");
    } finally {
      setAnsLoader(false);
    }
  };

  const handleNextOrSubmit = () => {
    if (selectedOption === null) return;

    const updatedAnswers = [...userAnswers, selectedOption];
    setUserAnswers(updatedAnswers);

    if (currentQuestion + 1 < aiQuestions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      checkAnswers(updatedAnswers);
    }
  };

  if (!location.state) {
    return <Navigate to="/courses" />;
  }

  if (loader) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-medium">
        Loading quiz...
      </div>
    );
  }

  if (showResult && result) {
    return (
      <div className="max-w-2xl mx-auto mt-16 p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Quiz Completed 🎉
        </h2>

        <div className="text-center mb-6">
          <p className="text-lg">
            Score:{" "}
            <span className="font-bold">{result.totalScore}</span> /{" "}
            {aiQuestions.length}
          </p>
          <p className="text-lg">
            Percentage:{" "}
            <span className="font-bold">{score}%</span>
          </p>
        </div>

        <hr className="mb-6" />

        <div className="space-y-6">
          {aiQuestions.map((q, index) => {
            const isCorrect = result.results[index] === "correct";

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  isCorrect
                    ? "bg-green-50 border-green-400"
                    : "bg-red-50 border-red-400"
                }`}
              >
                <h3 className="font-semibold mb-2">
                  Q{index + 1}. {q.question}
                </h3>

                <p className="mb-1">
                  <span className="font-medium">Your Answer:</span>{" "}
                  <span
                    className={
                      isCorrect
                        ? "text-green-700 font-semibold"
                        : "text-red-700 font-semibold"
                    }
                  >
                    {userAnswers[index]} {isCorrect ? "✔️" : "❌"}
                  </span>
                </p>

                {!isCorrect && (
                  <p>
                    <span className="font-medium">Correct Answer:</span>{" "}
                    <span className="text-green-700 font-semibold">
                      {result?.correctAnswers?.[index]}
                    </span>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate(`/student/course-details/${courseId}`)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {
              score >= 70 ? "Congratulations! You passed the quiz." : "Better luck next time"
            }
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={user?.profilePicture}
          alt={user?.username}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold">{user?.username}</h3>
          <p className="text-sm text-gray-500">{courseTitle}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded mb-6">
        <div
          className="bg-blue-600 h-2 rounded transition-all"
          style={{
            width: `${((currentQuestion + 1) / aiQuestions.length) * 100}%`,
          }}
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">
        Question {currentQuestion + 1} of {aiQuestions.length}
      </h2>

      <p className="mb-6">
        {aiQuestions[currentQuestion]?.question}
      </p>

      {/* Options */}
      <div className="space-y-4">
        {aiQuestions[currentQuestion]?.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(option)}
            className={`w-full text-left px-4 py-2 border rounded-lg transition
              ${
                selectedOption === option
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
          >
            {option}
          </button>
        ))}
      </div>


      <button
        onClick={handleNextOrSubmit}
        disabled={selectedOption === null || ansLoader}
        className={`mt-6 px-6 py-2 rounded text-white transition
          ${
            selectedOption === null || ansLoader
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {ansLoader
          ? "Checking..."
          : currentQuestion + 1 === aiQuestions.length
          ? "Submit"
          : "Next"}
      </button>
    </div>
  );
};

export default QuizPage;
