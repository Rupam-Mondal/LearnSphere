import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

const TOTAL_QUESTIONS = 5;
const QUESTION_TIME = 30;

let LOCKED_VOICE = null;

export default function InterviewPage() {
  const { courseName } = useParams();

  /* ---------------- STATES ---------------- */
  const [interviewState, setInterviewState] = useState("idle");
  const [status, setStatus] = useState("idle");
  const [messages, setMessages] = useState([]);
  const [answerCount, setAnswerCount] = useState(0);
  const [result, setResult] = useState(null);

  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [liveTranscript, setLiveTranscript] = useState("");

  /* ---------------- REFS ---------------- */
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const transcriptRef = useRef("");
  const submittedRef = useRef(false);
  const isListeningRef = useRef(false);

  function GeneratePdf(){
    console.log("Generating PDF...");
  }

  const { courseTitle, courseId, userId } = useLocation().state || {};
  /* ---------------- VOICE LOCK ---------------- */
  useEffect(() => {
    const loadVoice = () => {
      const voices = speechSynthesis.getVoices();
      LOCKED_VOICE =
        voices.find((v) => v.name === "Google US English") ||
        voices.find((v) => v.lang === "en-US") ||
        voices[0];
    };

    speechSynthesis.onvoiceschanged = loadVoice;
    loadVoice();
  }, []);

  /* ---------------- SPEECH RECOGNITION ---------------- */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (e) => {
      let transcript = "";

      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript + " ";
      }

      const finalText = transcript.trim();
      transcriptRef.current = finalText;
      setLiveTranscript(finalText);
    };

    recognition.onend = () => {
      isListeningRef.current = false;
    };

    recognition.onerror = () => {
      isListeningRef.current = false;
      setStatus("idle");
    };

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, []);

  /* ---------------- TIMER ---------------- */
  const startTimer = () => {
    setTimeLeft(QUESTION_TIME);
    submittedRef.current = false;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          autoSubmitAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  /* ---------------- START LISTENING ---------------- */
  const startListening = () => {
    if (!recognitionRef.current) return;
    if (isListeningRef.current) return;

    transcriptRef.current = "";
    setLiveTranscript("");
    setStatus("listening");

    try {
      recognitionRef.current.start();
      isListeningRef.current = true;
      startTimer();
    } catch (err) {
      console.log("Recognition restart blocked:", err);
    }
  };

  /* ---------------- AUTO SUBMIT ---------------- */
  const autoSubmitAnswer = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    stopTimer();
    recognitionRef.current?.stop();
    isListeningRef.current = false;
    setStatus("idle");

    const finalAnswer =
      transcriptRef.current.trim() !== ""
        ? transcriptRef.current.trim()
        : "No answer provided within time.";

    handleUserAnswer(finalAnswer);
  };

  /* ---------------- HANDLE ANSWER ---------------- */
  const handleUserAnswer = async (userText) => {
    if (submittedRef.current === false) {
      submittedRef.current = true;
    }

    stopTimer();
    setStatus("idle");

    setAnswerCount((prevCount) => {
      const newCount = prevCount + 1;

      setMessages((prevMessages) => {
        const updatedMessages = [
          ...prevMessages,
          { role: "user", content: userText },
        ];

        // If finished
        if (newCount >= TOTAL_QUESTIONS) {
          finishInterview(updatedMessages);
          return updatedMessages;
        }

        // Otherwise fetch next question
        fetchNextQuestion(updatedMessages);

        return updatedMessages;
      });

      return newCount;
    });
  };

  const fetchNextQuestion = async (updatedMessages) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ai/interview`,
        {
          topic: courseName,
          messages: updatedMessages,
        },
      );

      const aiText = res.data.reply;

      setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);

      speakAI(aiText);
    } catch (error) {
      console.error("Error fetching next question:", error);
    }
  };

  /* ---------------- SPEAK AI ---------------- */
  const speakAI = (text) => {
    setStatus("speaking");
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = LOCKED_VOICE;
    utterance.rate = 1.05;

    utterance.onend = () => {
      startListening();
    };

    speechSynthesis.speak(utterance);
  };

  /* ---------------- START INTERVIEW ---------------- */
  const startInterview = () => {
    setInterviewState("running");
    setAnswerCount(0);
    setMessages([]);
    setResult(null);

    const introQuestion = `Can you explain the fundamentals of ${courseName}?`;

    setMessages([{ role: "assistant", content: introQuestion }]);
    speakAI(introQuestion);
  };

  /* ---------------- FINISH INTERVIEW ---------------- */
  const finishInterview = async (finalMessages) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ai/result`,
        {
          topic: courseName,
          messages: finalMessages,
        },
      );
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/ai/quiz/updateMarks`,
        {
          courseId,
          userId,
          marks: res.data.score,
        },
      );

      setResult(res.data); // ✅ set result first
      setInterviewState("completed"); // ✅ THEN mark completed
      setStatus("idle");
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching result:", error);
    }
  };

  if (interviewState === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-24 px-6">
        <div className="max-w-6xl mx-auto bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
          {!result ? (
            <h2 className="text-xl font-semibold text-center text-gray-600 animate-pulse">
              Generating Result...
            </h2>
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Interview Result 🎉
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Review your performance and improve with suggested courses
                  </p>
                </div>

                <button
                  onClick={GeneratePdf}
                 className="text-sm px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
                  Download PDF
                </button>
              </div>

              {/* Score + Level */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <p className="text-gray-500 text-sm">Score</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {result.score}/10
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-xl">
                  <p className="text-gray-500 text-sm">Level</p>
                  <p className="text-3xl font-bold text-green-600">
                    {result.level}
                  </p>
                </div>
              </div>

              {/* Strengths and Weaknesses side by side */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Strengths */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                    Strengths
                  </h3>

                  <div className="space-y-2">
                    {result.strengths?.map((s, i) => (
                      <div
                        key={i}
                        className="bg-green-50 text-green-700 px-4 py-3 rounded-lg"
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weaknesses */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                    Areas to Improve
                  </h3>

                  <div className="space-y-2">
                    {result.weaknesses?.map((w, i) => (
                      <div
                        key={i}
                        className="bg-red-50 text-red-700 px-4 py-3 rounded-lg"
                      >
                        {w}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendation full width */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                  Recommendation
                </h3>

                <div className="bg-gray-50 p-5 rounded-lg text-gray-700">
                  {result.recommendation}
                </div>
              </div>

              {/* Suggested Courses full horizontal cards */}
              {result.suggestedCourses?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                    Suggested Courses to Improve
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {result.suggestedCourses.map((course, i) => (
                      <div
                        key={i}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition flex flex-col justify-between"
                      >
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-2">
                            {course.title}
                          </h4>

                          <p className="text-gray-600 text-sm mb-4">
                            {course.reason}
                          </p>
                        </div>

                        {/* Highlighted button */}
                        <a
                          href={course.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                          View Course →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-4">
          {courseTitle} Interview
        </h1>
        {interviewState === "idle" && (
          <button
            onClick={startInterview}
            className="px-10 py-4 bg-black text-white rounded-full mx-auto block"
          >
            Start Interview
          </button>
        )}

        {interviewState === "running" && (
          <>
            <div className="mb-4 text-sm">
              <p>
                Status: <b>{status}</b>
              </p>
              <p>
                Answers:{" "}
                <b>
                  {answerCount}/{TOTAL_QUESTIONS}
                </b>
              </p>
              <p>
                Time Left: <b>{timeLeft}s</b>
              </p>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl ${
                    m.role === "assistant"
                      ? "bg-gray-100"
                      : "bg-black text-white text-right"
                  }`}
                >
                  <b>{m.role === "assistant" ? "Interviewer" : "You"}:</b>
                  <p>{m.content}</p>
                </div>
              ))}
            </div>

            {status === "listening" && liveTranscript && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <b>Live Answer:</b>
                <p>{liveTranscript}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
