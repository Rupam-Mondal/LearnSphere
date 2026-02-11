import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
            setTimeLeft(prev => {
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

        setAnswerCount(prevCount => {
            const newCount = prevCount + 1;

            setMessages(prevMessages => {
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
                }
            );

            const aiText = res.data.reply;

            setMessages(prev => [
                ...prev,
                { role: "assistant", content: aiText },
            ]);

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
                }
            );

            setResult(res.data);          // ✅ set result first
            setInterviewState("completed"); // ✅ THEN mark completed
            setStatus("idle");
            console.log(res.data)

        } catch (error) {
            console.error("Error fetching result:", error);
        }
    };


    /* ---------------- RESULT UI ---------------- */
    if (interviewState === "completed") {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow max-w-xl w-full">
                    {!result ? (
                        <h2 className="text-xl font-semibold text-center">
                            Generating Result...
                        </h2>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-4 text-center">
                                Interview Result 🎉
                            </h2>

                            <p><b>Score:</b> {result.score}/10</p>
                            <p><b>Level:</b> {result.level}</p>

                            <div className="mt-4">
                                <b>Strengths</b>
                                <ul className="list-disc ml-6">
                                    {Array.isArray(result.strengths) &&
                                        result.strengths.map((s, i) => (
                                            <li key={i}>{s}</li>
                                        ))}
                                </ul>
                            </div>

                            <div className="mt-4">
                                <b>Weaknesses</b>
                                <ul className="list-disc ml-6">
                                    {Array.isArray(result.weaknesses) &&
                                        result.weaknesses.map((w, i) => (
                                            <li key={i}>{w}</li>
                                        ))}
                                </ul>
                            </div>

                            <p className="mt-4 font-medium">
                                {result.recommendation}
                            </p>
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
                            <p>Status: <b>{status}</b></p>
                            <p>Answers: <b>{answerCount}/{TOTAL_QUESTIONS}</b></p>
                            <p>Time Left: <b>{timeLeft}s</b></p>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto">
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`p-4 rounded-xl ${m.role === "assistant"
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
