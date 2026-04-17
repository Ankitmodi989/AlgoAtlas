import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI("AQ.Ab8RN6JxEVx9MSg9x4o5wOpXsFA209rp3XLkmYPp8YBwL8c2Ww");
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false); // Chat window open/close state
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: "user", text: input };
        setHistory(prev => [...prev, userMsg]);
        setLoading(true);
        setInput("");

        try {
            const result = await model.generateContent(input);
            const aiMsg = { role: "model", text: result.response.text() };
            setHistory(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.wrapper } >
            {/* 1. Chat Window (Sirf tab dikhega jab isOpen true ho) */}
            {isOpen && (
                <div style={styles.chatWindow}>
                    <div style={styles.header}>
                        <span>AI Assistant</span>
                        <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>×</button>
                    </div>
                    <div style={styles.messageArea}>
                        {history.map((msg, i) => (
                            <div key={i} style={msg.role === 'user' ? styles.userMsg : styles.aiMsg}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && <div style={styles.aiMsg}>...</div>}
                    </div>
                    <div style={styles.inputBox}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me..."
                            style={styles.input}
                        />
                    </div>
                </div>
            )}

            {/* 2. Floating Action Button (FAB) */}
            <button style={styles.fab} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? "↓" : "💬"}
            </button>
        </div>
    );
};

// Styles for Floating Chat
const styles = {
    wrapper: { position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 },
    fab: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', fontSize: '24px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
    chatWindow: { position: 'absolute', bottom: '80px', right: '0', width: '350px', height: '450px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    header: { padding: '15px', background: '#007bff', color: 'white', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' },
    closeBtn: { background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' },
    messageArea: { flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' },
    userMsg: { alignSelf: 'flex-end', background: '#007bff', color: 'black', padding: '8px 12px', borderRadius: '15px 15px 0 15px', maxWidth: '80%' },
    aiMsg: { alignSelf: 'flex-start', background: '#f0f0f0', color: '#333', padding: '8px 12px', borderRadius: '15px 15px 15px 0', maxWidth: '80%' },
    inputBox: { padding: '10px', borderTop: '1px solid #eee' },
    input: { width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ddd',color:'black' }
};

export default Chatbot;