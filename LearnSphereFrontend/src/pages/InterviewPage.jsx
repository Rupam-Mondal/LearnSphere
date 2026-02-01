import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TOTAL_QUESTIONS = 5;
let LOCKED_VOICE = null;

export default function InterviewPage() {
  const { courseName } = useParams();

  /* ---------------- STATES ---------------- */
  const [interviewState, setInterviewState] = useState("idle");
  // idle | running | completed

  const [status, setStatus] = useState("idle");
  // idle | speaking | listening

  const [messages, setMessages] = useState([]);
  const [answerCount, setAnswerCount] = useState(0);
  const [result, setResult] = useState(null);

  /* ---------------- REFS ---------------- */
  const recognitionRef = useRef(null);
  const speakingRef = useRef(false);

  /* ---------------- VOICE LOCK ---------------- */
  useEffect(() => {
    const loadVoice = () => {
      const voices = speechSynthesis.getVoices();
      LOCKED_VOICE =
        voices.find(v => v.name === "Google US English") ||
        voices.find(v => v.lang === "en-US") ||
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
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (e) => {
      const userText = e.results[0][0].transcript.trim();
      console.log("🎤 User:", userText);
      handleUserAnswer(userText);
    };

    recognition.onerror = (e) => {
      console.error("Speech error:", e.error);
      setStatus("idle");
    };

    recognitionRef.current = recognition;
  }, [messages, answerCount]);

  /* ---------------- SPEAK AI ---------------- */
  const speakAI = (text) => {
    speakingRef.current = true;
    setStatus("speaking");

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = LOCKED_VOICE;
    utterance.rate = 1.05;

    utterance.onend = () => {
      speakingRef.current = false;
      startListening();
    };

    speechSynthesis.speak(utterance);
  };

  /* ---------------- LISTEN USER ---------------- */
  const startListening = () => {
    if (!recognitionRef.current) return;
    setStatus("listening");
    recognitionRef.current.start();
  };

  /* ---------------- HANDLE ANSWER ---------------- */
  const handleUserAnswer = async (userText) => {
    recognitionRef.current.stop();
    setStatus("idle");

    const updatedMessages = [
      ...messages,
      { role: "user", content: userText },
    ];
    setMessages(updatedMessages);

    const newCount = answerCount + 1;
    setAnswerCount(newCount);

    // ✅ END INTERVIEW AFTER 5 ANSWERS
    if (newCount >= TOTAL_QUESTIONS) {
      finishInterview(updatedMessages);
      return;
    }

    // 🔁 GET NEXT QUESTION
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/ai/interview`,
      {
        topic: courseName,
        messages: updatedMessages,
      }
    );

    const aiText = res.data.reply;

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: aiText },
    ]);

    speakAI(aiText);
  };

  /* ---------------- START INTERVIEW ---------------- */
  const startInterview = async () => {
    setInterviewState("running");
    setAnswerCount(0);
    setMessages([]);

    const introQuestion = `Can you explain the fundamentals of ${courseName}?`;

    setMessages([{ role: "assistant", content: introQuestion }]);
    speakAI(introQuestion);
  };

  const finishInterview = async (finalMessages) => {
    setInterviewState("completed");
    setStatus("idle");

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/ai/result`,
      {
        topic: courseName,
        messages: finalMessages,
      }
    );

    setResult(res.data);
  };

  /* ---------------- RESULT UI ---------------- */
  if (interviewState === "completed" && result) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow max-w-xl w-full">
          <h2 className="text-2xl font-bold mb-2">Interview Result</h2>
          <p><b>Score:</b> {result.score}/10</p>
          <p><b>Level:</b> {result.level}</p>

          <div className="mt-4">
            <b>Strengths</b>
            <ul className="list-disc ml-6">
              {result.strengths.map(s => <li key={s}>{s}</li>)}
            </ul>
          </div>

          <div className="mt-4">
            <b>Weaknesses</b>
            <ul className="list-disc ml-6">
              {result.weaknesses.map(w => <li key={w}>{w}</li>)}
            </ul>
          </div>

          <p className="mt-4 font-medium">{result.recommendation}</p>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow p-6">

        {interviewState === "idle" && (
          <button
            onClick={startInterview}
            className="px-10 py-4 rounded-full bg-black text-white mx-auto block"
          >
            Start Interview
          </button>
        )}

        {interviewState === "running" && (
          <>
            <div className="text-sm mb-4">
              <p>Status: <b>{status}</b></p>
              <p>Answers: <b>{answerCount}/{TOTAL_QUESTIONS}</b></p>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl ${
                    m.role === "assistant"
                      ? "bg-gray-100 text-left"
                      : "bg-black text-white text-right"
                  }`}
                >
                  <b>{m.role === "assistant" ? "Interviewer" : "You"}:</b>
                  <p>{m.content}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
