import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

const TOTAL_QUESTIONS = 5;
const QUESTION_TIME = 15; // seconds

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

  function GeneratePdf() {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white pt-24 px-6">
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-2xl shadow-xl">

        {!result ? (
          <h2 className="text-xl font-semibold text-center animate-pulse">
            Generating Result...
          </h2>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold">Interview Result 🎉</h2>
                <p className="text-gray-400 text-sm">
                  AI-powered performance analysis
                </p>
              </div>

              <button
                onClick={GeneratePdf}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              >
                Download PDF
              </button>
            </div>

            {/* SCORE */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-blue-500/10 border border-blue-400/20 p-6 rounded-xl">
                <p className="text-gray-400 text-sm">Score</p>
                <p className="text-4xl font-bold text-blue-400">
                  {result.score}/10
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-400/20 p-6 rounded-xl">
                <p className="text-gray-400 text-sm">Level</p>
                <p className="text-4xl font-bold text-green-400">
                  {result.level}
                </p>
              </div>
            </div>

            {/* STRENGTHS & WEAKNESSES */}
            <div className="grid md:grid-cols-2 gap-8 mb-10">

              <div>
                <h3 className="font-semibold mb-4 text-lg text-green-400">
                  Strengths
                </h3>
                <div className="space-y-3">
                  {result.strengths?.map((s, i) => (
                    <div key={i} className="bg-green-500/10 p-3 rounded-lg">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 text-lg text-red-400">
                  Areas to Improve
                </h3>
                <div className="space-y-3">
                  {result.weaknesses?.map((w, i) => (
                    <div key={i} className="bg-red-500/10 p-3 rounded-lg">
                      {w}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RECOMMENDATION */}
            <div className="mb-10">
              <h3 className="font-semibold mb-3 text-lg">Recommendation</h3>
              <div className="bg-white/10 p-5 rounded-lg">
                {result.recommendation}
              </div>
            </div>

            {/* COURSES */}
            {result.suggestedCourses?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-5 text-lg">
                  Suggested Courses
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {result.suggestedCourses.map((course, i) => (
                    <div
                      key={i}
                      className="p-6 rounded-xl bg-white/5 border border-white/10 hover:scale-[1.02] transition"
                    >
                      <h4 className="text-lg font-semibold mb-2">
                        {course.title}
                      </h4>

                      <p className="text-gray-400 text-sm mb-4">
                        {course.reason}
                      </p>

                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex justify-center px-4 py-20">
      <div className="w-full max-w-4xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-6 h-[85vh] flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h1 className="text-2xl font-bold tracking-wide">
            🎤 {courseTitle} Interview
          </h1>

          {interviewState === "running" && (
            <div className="flex items-center gap-6 text-sm">

              <div>
                <span className="text-gray-400">Answers</span>
                <p className="font-bold">{answerCount}/{TOTAL_QUESTIONS}</p>
              </div>

              <div>
                <span className="text-gray-400">Status</span>
                <p className={`font-semibold ${status === "listening" ? "text-green-400 animate-pulse" :
                  status === "speaking" ? "text-blue-400" :
                    "text-gray-300"
                  }`}>
                  {status}
                </p>
              </div>

              {/* TIMER */}
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                  {timeLeft}s
                </div>
                <div className={`w-full h-full rounded-full border-4 ${timeLeft < 10 ? "border-red-500 animate-pulse" : "border-blue-400"
                  }`} />
              </div>

            </div>
          )}
        </div>

        {/* START BUTTON */}
        {interviewState === "idle" && (
          <div className="flex flex-col items-center justify-center py-16">
            <button
              onClick={startInterview}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition rounded-full text-lg font-semibold shadow-lg"
            >
              Start AI Interview 🚀
            </button>
          </div>
        )}

        {/* CHAT AREA */}
        {interviewState === "running" && (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-700">

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${m.role === "assistant"
                      ? "bg-white/10 text-white rounded-bl-none"
                      : "bg-blue-600 text-white rounded-br-none"
                      }`}
                  >
                    <p className="text-xs opacity-70 mb-1">
                      {m.role === "assistant" ? "Interviewer" : "You"}
                    </p>
                    {m.content}
                  </div>
                </div>
              ))}

            </div>

            {/* LIVE TRANSCRIPT */}
            {status === "listening" && (
              <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-400/30">
                <p className="text-green-300 text-sm mb-1">🎙 Listening...</p>
                <p className="text-white">{liveTranscript || "Speak now..."}</p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
