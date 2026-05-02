import {
  BotIcon,
  ExternalLink,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import axios from "axios";

const quickPrompts = [
  "Recommend a Java course",
  "I want to learn web development",
  "Best course for interview prep",
];

const extractCourseLinks = (text) => {
  const urlRegex = /https?:\/\/[^\s)]+/g;
  return [...new Set(text.match(urlRegex) || [])].map((url) =>
    url.replace(/[()[\]{}.,]+$/g, ""),
  );
};

const cleanMessageText = (text) =>
  text
    .replace(/https?:\/\/[^\s)]+/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const getCourseTitleFromText = (text, url, index) => {
  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const beforeUrl = text.split(new RegExp(escapedUrl))[0] || "";
  const lines = beforeUrl
    .split("\n")
    .map((line) => line.replace(/^[-*\d.)\s]+/, "").trim())
    .filter(Boolean);

  return lines.at(-1)?.replace(/:?$/, "") || `Recommended course ${index + 1}`;
};

const BotMessage = ({ text }) => {
  const links = useMemo(() => extractCourseLinks(text), [text]);
  const body = cleanMessageText(text);

  return (
    <div className="space-y-3">
      {body && <p className="whitespace-pre-line leading-6">{body}</p>}
      {links.length > 0 && (
        <div className="space-y-2">
          {links.map((link, index) => (
            <a
              key={link}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-teal-100 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md"
            >
              <div className="min-w-0">
                <p className="line-clamp-1 text-sm font-black text-slate-900">
                  {getCourseTitleFromText(text, link, index)}
                </p>
                <p className="mt-0.5 text-xs font-semibold text-teal-700">
                  Open course details
                </p>
              </div>
              <ExternalLink className="h-4 w-4 flex-shrink-0 text-slate-400 transition group-hover:text-teal-700" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const Bot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi, I can help you find the right LearnSphere course. Tell me your goal, skill level, or topic.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const pendingPrompt = useRef("");

  const sendPrompt = async (prompt) => {
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    pendingPrompt.current = trimmed;
    const nextMessages = [...messages, { from: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ai/request`,
        { prompt: trimmed },
      );

      setMessages([
        ...nextMessages,
        {
          from: "bot",
          text:
            res.data.suggetion ||
            "I could not find a recommendation for that yet.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Sorry, I could not fetch course recommendations right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      pendingPrompt.current = "";
    }
  };

  return (
    <>
      <button
        className="fixed bottom-5 right-5 z-50 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-slate-950 text-white shadow-2xl shadow-slate-950/25 ring-4 ring-white transition hover:-translate-y-1 hover:bg-teal-700 hover:shadow-teal-700/30 active:translate-y-0"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle LearnSphere assistant"
      >
        {isOpen ? <X className="h-7 w-7" /> : <BotIcon className="h-8 w-8" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[560px] w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl sm:right-5">
          <header className="relative overflow-hidden bg-slate-950 p-5 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(20,184,166,0.28),transparent_34%),radial-gradient(circle_at_90%_18%,rgba(245,158,11,0.18),transparent_26%)]" />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <MessageCircle className="h-6 w-6 text-teal-200" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase text-teal-200">
                    Course advisor
                  </p>
                  <h2 className="text-lg font-black">LearnSphere AI</h2>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="border-b border-slate-200 bg-slate-50 p-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendPrompt(prompt)}
                  disabled={loading}
                  className="flex flex-shrink-0 cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700 disabled:cursor-wait disabled:opacity-60"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f7f8fb] p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.from}-${index}`}
                className={`max-w-[86%] rounded-[1.25rem] p-3 text-sm shadow-sm ${
                  message.from === "user"
                    ? "ml-auto bg-slate-950 text-white"
                    : "mr-auto border border-slate-200 bg-white text-slate-800"
                }`}
              >
                {message.from === "bot" ? (
                  <BotMessage text={message.text} />
                ) : (
                  message.text
                )}
              </div>
            ))}

            {loading && (
              <div className="mr-auto flex max-w-[86%] items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-500 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-teal-700" />
                Finding the best match for "{pendingPrompt.current}"...
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) =>
                  event.key === "Enter" && sendPrompt(input)
                }
                placeholder="Ask for a course recommendation..."
                className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                disabled={loading}
              />
              <button
                onClick={() => sendPrompt(input)}
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20 transition hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Bot;
