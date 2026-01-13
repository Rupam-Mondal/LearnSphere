import Vapi from "@vapi-ai/web";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);

export default function VapiInterview() {
    const {topic } = useParams(); 
  const [status, setStatus] = useState("idle");
  const sessionId = useRef(crypto.randomUUID());

  /* LISTEN TO USER SPEECH */
  useEffect(() => {
    const onMessage = async (msg) => {
      if (msg.type === "transcript" && msg.transcript?.text) {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/interview/answer`,
          {
            sessionId: sessionId.current,
            userAnswer: msg.transcript.text,
          }
        );

        vapi.send({
          type: "assistant-message",
          message: res.data.question,
        });
      }
    };

    vapi.on("message", onMessage);
    return () => vapi.off("message", onMessage);
  }, []);

  /* START INTERVIEW */
  const start = async () => {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/interview/start`,
      {
        sessionId: sessionId.current,
        topic,
      }
    );

    await vapi.start({
      voice: { provider: "vapi", voiceId: "Elliot" },
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en",
      },
      firstMessage: `Let's begin your ${topic} interview.`,
    });

    setStatus("live");
  };

  /* END INTERVIEW + SCORE */
  const stop = async () => {
    vapi.stop();

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/evaluate`,
      {
        sessionId: sessionId.current,
      }
    );

    alert(`Score: ${res.data.score}/10\n${res.data.feedback}`);
    setStatus("idle");
  };

  return (
    <div className="flex flex-col gap-4 p-4 items-center justify-center h-screen">
      <h1>{topic} Interview</h1>

      {status === "idle" ? (
        <button onClick={start}>Start Interview</button>
      ) : (
        <button onClick={stop}>End Interview</button>
      )}
    </div>
  );
}
