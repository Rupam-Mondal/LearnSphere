const sessions = new Map();

export function initSession(sessionId, topic) {
  sessions.set(sessionId, {
    topic,
    messages: [
      {
        role: "system",
        content: `
You are a strict technical interviewer.
Topic: ${topic}

Rules:
- Ask one question at a time
- Ask follow-up questions
- Stay strictly on the topic
- Do NOT give answers
        `,
      },
    ],
  });
}

export function getSession(sessionId) {
  return sessions.get(sessionId);
}

export function addMessage(sessionId, message) {
  sessions.get(sessionId).messages.push(message);
}

export function endSession(sessionId) {
  const session = sessions.get(sessionId);
  sessions.delete(sessionId);
  return session;
}
