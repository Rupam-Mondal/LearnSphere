import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function InterviewPage() {
  const { courseName } = useParams();

  /* ---------------- STATE ---------------- */
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle"); 
  const [timeLeft, setTimeLeft] = useState(300);

  /* ---------------- REFS ---------------- */
  const recognitionRef = useRef(null);
  const speakingRef = useRef(false);

  // Audio reactive waveform refs
  const barsRef = useRef([]);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  /* ---------------- INIT SPEECH RECOGNITION ---------------- */
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
      handleUserResponse(e.results[0][0].transcript);
    };

    recognition.onend = () => {
      if (!speakingRef.current) {
        stopMicVisualizer();
        setStatus("idle");
      }
    };

    recognitionRef.current = recognition;
  }, []);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (status === "idle") return;

    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(t - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  /* ---------------- SPEAK ---------------- */
  const speak = (text) => {
    speakingRef.current = true;
    setStatus("speaking");

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    utterance.onend = () => {
      speakingRef.current = false;
      startListening();
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  /* ---------------- START LISTENING ---------------- */
  const startListening = async () => {
    if (!recognitionRef.current) return;
    setStatus("listening");
    await startMicVisualizer();
    recognitionRef.current.start();
  };

  /* ---------------- USER RESPONSE ---------------- */
  const handleUserResponse = async (userText) => {
    const updated = [...messages, { role: "user", content: userText }];
    setMessages(updated);

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/ai/interview`,
      { topic: courseName, messages: updated }
    );

    if (res.data?.reply) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.reply },
      ]);
      speak(res.data.reply);
    }
  };

  /* ---------------- START INTERVIEW ---------------- */
  const startInterview = () => {
    const intro = `Hello, I will be your technical interviewer today.
The topic is ${courseName}.
Let us begin.

Can you explain the fundamentals of ${courseName}?`;

    setMessages([{ role: "assistant", content: intro }]);
    speak(intro);
  };

  const startMicVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const MAX_BAR_HEIGHT = 30;

      const animate = () => {
        analyser.getByteFrequencyData(dataArray);

        barsRef.current.forEach((bar, i) => {
          if (!bar) return;
          const value = dataArray[i] || 0;
          const height = Math.min(MAX_BAR_HEIGHT, Math.max(8, value / 3));
          bar.style.height = `${height}px`;
        });

        rafRef.current = requestAnimationFrame(animate);
      };

      animate();
    } catch (err) {
      console.error("Mic permission denied", err);
    }
  };

  const stopMicVisualizer = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close();

    barsRef.current.forEach((bar) => {
      if (bar) bar.style.height = "8px";
    });
  };

  const videoSrc =
    status === "speaking"
      ? "/videos/speaking.mp4"
      : status === "listening"
        ? "/videos/listening.mp4"
        : "/videos/idle.mp4";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-6">
      <div className="relative w-full max-w-6xl py-6">
        {/* Soft outer glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200/40 via-white to-gray-200/40 blur-2xl rounded-[36px]" />

        {/* Main glass card */}
        <div className="relative top-8 h-full bg-white/70 backdrop-blur-xl rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] px-8 py-6">

          {/* HEADER */}
          <div className="mb-4">
            <h1 className="text-3xl font-semibold text-gray-900 capitalize">
              {courseName} Interview
            </h1>
            <p className="text-xs text-gray-500 mt-1 tracking-wide">
              Remaining Time · {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </p>
          </div>

          {/* TWO COLUMN LAYOUT */}
          <div className="grid grid-cols-[1.2fr_1fr] gap-6 h-[calc(100%-56px)]">

            {/* LEFT: INTERVIEW PANEL */}
            <div className="flex flex-col items-center justify-start">

              {/* AVATAR */}
              <div className="relative mb-4">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-gray-200 via-white to-gray-300 blur-lg opacity-60" />
                <div className="relative w-56 h-56 rounded-full overflow-hidden bg-white shadow-xl ring-1 ring-gray-200">
                  <video
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* WAVEFORM BOX */}
              <div
                className={`w-[300px] h-[56px] rounded-xl bg-white/90 
              border border-gray-200 shadow-inner
              flex items-center justify-center overflow-hidden
              transition-all duration-300 ${status === "listening"
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                  }`}
              >
                <div className="flex gap-[5px] h-10 items-end">
                  {[...Array(14)].map((_, i) => (
                    <span
                      key={i}
                      ref={(el) => (barsRef.current[i] = el)}
                      className="w-[3px] rounded-full transition-all duration-75"
                      style={{
                        height: "8px",
                        background:
                          "linear-gradient(to top, #16a34a, #4ade80)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* STATUS */}
              <div className="h-5 mt-3">
                {status === "speaking" && (
                  <p className="text-blue-600 text-xs animate-pulse">
                    Interviewer speaking
                  </p>
                )}
                {status === "listening" && (
                  <p className="text-green-600 text-xs animate-pulse">
                    Listening · Speak now
                  </p>
                )}
              </div>

              {/* START BUTTON */}
              {status === "idle" && (
                <button
                  onClick={startInterview}
                  className="mt-6 px-10 py-3 rounded-full bg-gray-900 text-white text-sm font-medium
                shadow hover:shadow-lg hover:scale-[1.03] transition"
                >
                  Start Interview
                </button>
              )}
            </div>

            {/* RIGHT: CHAT PANEL */}
            <div className="h-full bg-white/60 backdrop-blur rounded-2xl border border-gray-200 shadow-inner flex flex-col overflow-hidden">

              {/* CHAT HEADER */}
              <div className="px-5 py-4 border-b border-gray-200 text-sm font-medium text-gray-700">
                Interview Transcript
              </div>

              {/* CHAT BODY */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.map((m, i) => {
                  const isAI = m.role === "assistant";

                  return (
                    <div
                      key={i}
                      className={`flex ${isAI ? "justify-start" : "justify-end"}`}
                    >
                      <div className="max-w-[85%] w-full flex flex-col">
                        <span
                          className={`mb-1 text-[11px] font-medium tracking-wide uppercase ${isAI ? "text-gray-500" : "text-gray-400"
                            }`}
                        >
                          {isAI ? "Interviewer" : "You"}
                        </span>

                        <div
                          className={`px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-sm ${isAI
                              ? "bg-white border border-gray-200 text-gray-800"
                              : "bg-gradient-to-br from-gray-900 to-black text-white"
                            }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
