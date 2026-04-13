import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are an expert DSA (Data Structures and Algorithms) instructor. 
Your job is to help students learn DSA concepts clearly and effectively.

Guidelines:
- Explain concepts simply with examples
- Give hints instead of direct answers when students are stuck
- Provide code examples in JavaScript/Python when needed
- Use analogies to explain complex topics
- Encourage students and be patient
- Focus only on DSA topics like sorting, searching, trees, graphs, dynamic programming, etc.
- If asked non-DSA questions, politely redirect to DSA topics`;

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! 👋 I'm your DSA Instructor! Ask me anything about Data Structures & Algorithms — sorting, trees, graphs, DP, and more!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Gemini ke liye chat history banao
      const chatHistory = newMessages
        .filter(m => m.role === "user" || m.role === "assistant")
        .filter((m, i, arr) => {
          if (i === 0 && m.role === "assistant") return false;
          return true;
        })
        .map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBV2SoCuiwog3M5DDjZMsdwaSYHAL6qduA`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_PROMPT }]
            },
            contents: chatHistory
          })
        }
      );

      const data = await response.json();
      console.log("Gemini Response:", data);

      const reply = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);

    } catch (err) {
      console.log("Error:", err);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, something went wrong. Please try again!" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#378ADD",
          color: "white",
          border: "none",
          fontSize: 28,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {open ? "✕" : "🤖"}
      </button>

      {open && (
        <div style={{
          position: "fixed",
          bottom: 96,
          right: 24,
          width: 360,
          height: 500,
          background: "var(--card-bg)",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #378ADD"
        }}>
          <div style={{
            background: "#378ADD",
            padding: "14px 16px",
            color: "white",
            fontWeight: 700,
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            gap: 10
          }}>
            <span>🤖</span>
            <div>
              <div>DSA Instructor</div>
              <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.85 }}>
                Ask me anything about DSA!
              </div>
            </div>
          </div>

          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: 10
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
              }}>
                <div style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                  background: msg.role === "user" ? "#378ADD" : "#f0f4f8",
                  color: msg.role === "user" ? "white" : "#1a1a2e",
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap"
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "10px 14px",
                  borderRadius: "16px 16px 16px 4px",
                  background: "#f0f4f8",
                  color: "#666",
                  fontSize: 14
                }}>
                  Thinking... 🤔
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{
            padding: "10px 12px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            gap: 8
          }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about DSA..."
              rows={2}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                fontSize: 14,
                resize: "none",
                outline: "none",
                fontFamily: "sans-serif",
                background: "var(--card-bg)",
                color: "var(--primary-color)"
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                padding: "8px 14px",
                background: loading || !input.trim() ? "#ccc" : "#378ADD",
                color: "white",
                border: "none",
                borderRadius: 10,
                cursor: loading || !input.trim() ? "default" : "pointer",
                fontSize: 18
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}