import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Vapi from "@vapi-ai/web";

export default function InterviewPage() {
  const { courseName } = useParams();

  const vapiRef = useRef(null);

  const [status, setStatus] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(300);

  const PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
  const ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;

  useEffect(() => {
    vapiRef.current = new Vapi(PUBLIC_KEY);

    return () => {
      vapiRef.current?.stop();
    };
  }, [PUBLIC_KEY]);

  // Countdown Timer
  useEffect(() => {
    if (status !== "active") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const startInterview = async () => {
    setStatus("connecting");

    try {
      await vapiRef.current.start({
        assistantId: ASSISTANT_ID,

        // 🔥 MOST IMPORTANT PART
        assistantOverrides: {
          variables: {
            topic: courseName,
          },
        },
      });

      setStatus("active");
    } catch (err) {
      console.error("Vapi start error:", err);
      setStatus("idle");
    }
  };

  const endInterview = async () => {
    try {
      await vapiRef.current.stop();
    } catch (err) {
      console.error("Vapi stop error:", err);
    }
    setStatus("ended");
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-black text-white gap-6">
      <h1 className="text-3xl font-semibold capitalize">
        {courseName} Interview
      </h1>

      {status === "idle" && (
        <button
          onClick={startInterview}
          className="px-6 py-3 bg-green-600 rounded-full text-lg"
        >
          Start Interview
        </button>
      )}

      {status === "connecting" && (
        <p className="text-yellow-400 text-lg">
          Connecting to interviewer...
        </p>
      )}

      {status === "active" && (
        <>
          <p className="text-green-400 text-lg">
            Interview in progress
          </p>

          <p className="text-xl">
            Time Left: {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </p>

          <button
            onClick={endInterview}
            className="px-6 py-3 bg-red-600 rounded-full"
          >
            End Interview
          </button>
        </>
      )}

      {status === "ended" && (
        <p className="text-blue-400 text-xl">
          Interview completed. Thank you!
        </p>
      )}
    </div>
  );
}
