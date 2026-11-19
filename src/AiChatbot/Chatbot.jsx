import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const model = apiKey
    ? new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-1.5-flash" })
    : null;

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false); // Chat window open/close state
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const userPrompt = input.trim();
        const userMsg = { role: "user", text: userPrompt };
        setHistory(prev => [...prev, userMsg]);
        setLoading(true);
        setInput("");

        try {
            if (!model) {
                throw new Error("VITE_GEMINI_API_KEY is missing");
            }

            const result = await model.generateContent(userPrompt);
            const aiMsg = { role: "model", text: result.response.text() };
            setHistory(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            const message = error.message.includes("VITE_GEMINI_API_KEY")
                ? "Chatbot is not configured. Add VITE_GEMINI_API_KEY to the frontend .env file and restart Vite."
                : "I could not connect to Gemini. Check the API key and try again.";
            setHistory(prev => [...prev, { role: "model", text: message }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            {/* 1. Chat Window */}
            {isOpen && (
                <div style={styles.chatWindow}>
                    <div style={styles.header}>
                        <span>🤖 AlgoAtlas AI Assistant</span>
                        <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>×</button>
                    </div>
                    <div style={styles.messageArea}>
                        {history.length === 0 && (
                            <div style={{ textAlign: 'center', opacity: 0.6, fontSize: '13px', margin: 'auto 0' }}>
                                👋 Ask me anything about algorithms, complexity, or DSA problems!
                            </div>
                        )}
                        {history.map((msg, i) => (
                            <div key={i} style={msg.role === 'user' ? styles.userMsg : styles.aiMsg}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && <div style={styles.aiMsg}>Thinking...</div>}
                    </div>
                    <div style={styles.inputBox}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask a question..."
                            style={styles.input}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            style={{
                                padding: '8px 12px',
                                background: input.trim() && !loading ? '#6366f1' : '#9ca3af',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                                fontSize: '13px',
                                fontWeight: 600,
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}

            {/* 2. Floating Action Button (FAB) */}
            <button style={styles.fab} onClick={() => setIsOpen(!isOpen)} title="AI Assistant">
                {isOpen ? "✕" : "💬"}
            </button>
        </div>
    );
};

// Styles for Floating Chat
const styles = {
    wrapper: { position: 'fixed', bottom: '24px', right: '24px', zIndex: 2000 },
    fab: { width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontSize: '22px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    chatWindow: { position: 'absolute', bottom: '70px', right: '0', width: '340px', height: '440px', backgroundColor: '#111827', borderRadius: '16px', boxShadow: '0 12px 36px rgba(0,0,0,0.55)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(148,163,184,0.25)' },
    header: { padding: '14px 16px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '14px' },
    closeBtn: { background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', padding: '0 4px' },
    messageArea: { flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', background: '#0f172a' },
    userMsg: { alignSelf: 'flex-end', background: '#6366f1', color: '#ffffff', padding: '9px 13px', borderRadius: '14px 14px 2px 14px', maxWidth: '82%', fontSize: '13px', lineHeight: 1.4 },
    aiMsg: { alignSelf: 'flex-start', background: '#1e293b', color: '#e2e8f0', padding: '9px 13px', borderRadius: '14px 14px 14px 2px', maxWidth: '82%', fontSize: '13px', lineHeight: 1.4 },
    inputBox: { padding: '10px 12px', borderTop: '1px solid #334155', display: 'flex', gap: '8px', background: '#111827' },
    input: { flex: 1, padding: '8px 12px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #475569', background: '#1e293b', color: '#f8fafc', fontSize: '13px', outline: 'none' }
};

export default Chatbot;