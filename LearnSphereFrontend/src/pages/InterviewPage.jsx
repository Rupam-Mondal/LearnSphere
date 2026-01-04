import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function InterviewPage() {
  const { courseName } = useParams(); // topic
  const recognitionRef = useRef(null);
  const speakingRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | speaking | listening
  const [timeLeft, setTimeLeft] = useState(300);

  /* ---------------- INIT SPEECH RECOGNITION ---------------- */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (e) => {
      const userText = e.results[0][0].transcript;
      handleUserResponse(userText);
    };

    recognition.onend = () => {
      if (!speakingRef.current) {
        setStatus("idle");
      }
    };

    recognitionRef.current = recognition;
  }, []);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (status === "idle") return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) return 0;
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  /* ---------------- SPEAK FUNCTION ---------------- */
  const speak = (text) => {
    speakingRef.current = true;
    setStatus("speaking");

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    utterance.onend = () => {
      speakingRef.current = false;
      startListening(); // 🎯 REOPEN MIC AFTER AI SPEAKS
    };

    speechSynthesis.speak(utterance);
  };

  /* ---------------- START MIC ---------------- */
  const startListening = () => {
    if (!recognitionRef.current) return;
    setStatus("listening");
    recognitionRef.current.start();
  };

  /* ---------------- SEND USER RESPONSE ---------------- */
  const handleUserResponse = async (userText) => {
    const updatedMessages = [...messages, { role: "user", content: userText }];
    setMessages(updatedMessages);

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/ai/interview`,
      {
        topic: courseName,
        messages: updatedMessages,
      }
    );

    const data = res.data;

    if (data?.reply) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
      speak(data.reply);
    }
  };

  /* ---------------- START INTERVIEW ---------------- */
  const startInterview = async () => {
    setStatus("speaking");

    const firstMessage = `Hello! I will be your technical interviewer today.

The interview topic is ${courseName}.

Let us begin.

First question:
Can you explain the basic fundamentals of ${courseName}?`;

    setMessages([{ role: "assistant", content: firstMessage }]);
    speak(firstMessage);
  };

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-3xl font-bold capitalize">{courseName} Interview</h1>

      <p className="text-lg">
        Time Left: {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </p>

      {status === "idle" && (
        <button
          onClick={startInterview}
          className="px-8 py-3 bg-green-600 rounded-full text-lg hover:bg-green-700 transition"
        >
          Start Interview
        </button>
      )}

      {status === "speaking" && (
        <p className="text-blue-400 text-lg">Interviewer speaking…</p>
      )}

      {status === "listening" && (
        <p className="text-green-400 text-lg">Listening… answer now</p>
      )}

      <div className="w-full max-w-2xl bg-white text-black rounded-xl p-4 overflow-y-auto max-h-64">
        {messages.map((m, i) => (
          <p key={i} className="mb-2">
            <strong>{m.role === "assistant" ? "AI" : "You"}:</strong>{" "}
            {m.content}
          </p>
        ))}
      </div>
    </div>
  );
}
