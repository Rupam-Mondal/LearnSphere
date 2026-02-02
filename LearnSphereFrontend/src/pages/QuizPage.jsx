import React, { use, useContext, useEffect, useRef, useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import axios from "axios";

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseTitle, courseId,userId } = location.state || {};
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

  useEffect(() => {
    if (!userId || !courseTitle || !courseId) return;

    const fetchAIQuestions = async () => {
      setLoader(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/ai/quiz?topic=${courseTitle}`,
        );
        setAiQuestions(res.data.quiz || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoader(false);
      }
    };

    fetchAIQuestions();
  }, []);



  const checkAnswers = async (finalAnswers) => {
    setAnsLoader(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ai/quiz/check`,
        {
          questionList: aiQuestions,
          userAnswersList: finalAnswers,
        },
      );
      setScore(res.data.score);
      setResult(res.data.result);
      setShowResult(true);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/ai/quiz/updateMarks`,
        {
          courseId,
          userId,
          marks: res.data.score,
        },
      );

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

  if (!location.state) return <Navigate to="/" />;


  if (loader) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-medium animate-pulse">
          Preparing your quiz...
        </p>
      </div>
    );
  }


  if (showResult && result) {
    const isPassed = score >= 70;
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div
            className={`p-8 text-center text-white ${isPassed ? "bg-emerald-500" : "bg-rose-500"}`}
          >
            <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
            <p className="text-emerald-50 opacity-90">
              Here is how you performed in {courseTitle}
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-xl text-center">
                <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">
                  Score
                </p>
                <p className="text-2xl font-bold text-slate-800">
                  {result.totalScore} / {aiQuestions.length}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl text-center">
                <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">
                  Percentage
                </p>
                <p className="text-2xl font-bold text-slate-800">{score}%</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-700 mb-4">
                Review Answers
              </h3>
              {aiQuestions.map((q, index) => {
                const isCorrect = result.results[index] === "correct";
                return (
                  <div
                    key={index}
                    className={`p-5 rounded-xl border-2 transition-all ${isCorrect ? "border-emerald-100 bg-emerald-50/30" : "border-rose-100 bg-rose-50/30"}`}
                  >
                    <p className="font-semibold text-slate-800 mb-3">
                      <span className="opacity-50 mr-2">#{index + 1}</span>{" "}
                      {q.question}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
                      <p>
                        <span className="text-slate-500 block mb-1">
                          Your Answer
                        </span>
                        <span
                          className={`font-bold ${isCorrect ? "text-emerald-600" : "text-rose-600"}`}
                        >
                          {userAnswers[index]} {isCorrect ? "✓" : "✕"}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p>
                          <span className="text-slate-500 block mb-1">
                            Correct Answer
                          </span>
                          <span className="font-bold text-emerald-600">
                            {result?.correctAnswers?.[index]}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate(`/student/course-details/${courseId}`)}
              className={`w-full mt-10 py-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.01] active:scale-95 shadow-lg ${
                isPassed
                  ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
              }`}
            >
              {isPassed
                ? "Return to Course — Great Job!"
                : "Return to Course & Try Again"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/60 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.profilePicture}
                alt=""
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-50"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 leading-tight">
                {user?.username}
              </h3>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {courseTitle}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Question {currentQuestion + 1} / {aiQuestions.length}
            </span>
          </div>
        </div>


        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-blue-600 h-full transition-all duration-500 ease-out"
            style={{
              width: `${((currentQuestion + 1) / aiQuestions.length) * 100}%`,
            }}
          />
        </div>

        <div className="p-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-snug">
            {aiQuestions[currentQuestion]?.question}
          </h2>

          <div className="space-y-3">
            {aiQuestions[currentQuestion]?.options.map((option, index) => {
              const isActive = selectedOption === option;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedOption(option)}
                  className={`group w-full flex items-center text-left px-6 py-4 rounded-2xl border-2 transition-all duration-200 
                    ${
                      isActive
                        ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100"
                        : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"
                    }`}
                >
                  <span
                    className={`w-8 h-8 flex items-center justify-center rounded-lg mr-4 text-sm font-bold transition-colors
                    ${isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-blue-100"}`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span
                    className={`font-medium ${isActive ? "text-blue-900" : "text-slate-600"}`}
                  >
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={handleNextOrSubmit}
              disabled={selectedOption === null || ansLoader}
              className={`px-10 py-3 rounded-2xl font-bold text-white transition-all shadow-lg
                ${
                  selectedOption === null || ansLoader
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
                }`}
            >
              {ansLoader ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Checking...
                </span>
              ) : currentQuestion + 1 === aiQuestions.length ? (
                "Finish Quiz"
              ) : (
                "Next Question"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
