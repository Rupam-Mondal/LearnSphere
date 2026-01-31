import React, { useContext, useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";

const quizData = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyperlinks and Text Markup Language",
      "Home Tool Markup Language",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which language is used for styling web pages?",
    options: ["HTML", "JQuery", "CSS", "XML"],
    correctAnswer: 2,
  },
];

const QuizPage = () => {
  const location = useLocation();
  const { courseTitle } = location.state || {};
  const { user } = useContext(UserContext);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("User taking the quiz:", user.username);
    }
  }, [user]);

  if (!location.state) {
    return <Navigate to="/courses" />;
  }

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === quizData[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setSelectedOption(null);

    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h1>Quiz Completed 🎉</h1>
        <h2>{courseTitle}</h2>
        <p>
          Score: {score} / {quizData.length}
        </p>
        <p>Well done, {user?.username} 👏</p>
      </div>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={user?.profilePicture}
          alt={user?.username}
          width="50"
          height="50"
          style={{ borderRadius: "50%" }}
        />
        <div>
          <h3>{user?.username}</h3>
          <small>{courseTitle}</small>
        </div>
      </div>

      <hr />

      <h2>
        Question {currentQuestion + 1} / {quizData.length}
      </h2>
      <p>{question.question}</p>

      {/* Options */}
      <div>
        {question.options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(index)}
            style={{
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
              background:
                selectedOption === index ? "#dbeafe" : "#fff",
            }}
          >
            {option}
          </div>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={selectedOption === null}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: selectedOption === null ? "not-allowed" : "pointer",
        }}
      >
        {currentQuestion + 1 === quizData.length ? "Submit" : "Next"}
      </button>
    </div>
  );
};

export default QuizPage;
