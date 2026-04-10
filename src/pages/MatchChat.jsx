// src/pages/MatchChat.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../api/authFetch";

export default function MatchChat() {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const chatEndRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");

    useEffect(() => {
        async function loadMessages() {
            try {
                const res = await authFetch(`/MatchChat/${matchId}`);
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || "Ошибка при загрузке сообщений");
                }
                const data = await res.json();
                setMessages(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadMessages();
    }, [matchId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const res = await authFetch(`/MatchChat/${matchId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: newMessage })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Ошибка при отправке сообщения");
            }

            setMessages(prev => [...prev, {
                id: Date.now(),
                senderId: 0,
                username: "You",
                message: newMessage,
                createdAt: new Date().toISOString()
            }]);
            setNewMessage("");
        } catch (err) {
            setToast(err.message);
            setTimeout(() => setToast(""), 3000);
        }
    };

    if (loading) return <p style={loadingStyle}>Loading messages...</p>;
    if (error) return <p style={errorStyle}>{error}</p>;

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button
                    style={backBtnStyle}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <h2 style={titleStyle}>Match Chat #{matchId}</h2>

                <div style={chatBoxStyle}>
                    {messages.length === 0 ? (
                        <p style={noDataStyle}>No messages yet</p>
                    ) : messages.map(msg => (
                        <div key={msg.id} style={messageStyle(msg.senderId === 0)}>
                            <b>{msg.username}:</b> {msg.message}
                            <div style={msgTimeStyle}>
                                {new Date(msg.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div style={inputContainerStyle}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        style={inputStyle}
                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        style={sendBtnStyle}
                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                        onClick={sendMessage}
                    >
                        Send
                    </button>
                </div>

                {toast && <div style={toastStyle}>{toast}</div>}
            </div>
        </div>
    );
}

/* ── Styles ── */

const pageStyle = {
    minHeight: "100vh",
    paddingTop: "120px",
    backgroundImage: `
        linear-gradient(135deg, rgba(0,0,0,0.75), rgba(10,30,10,0.85)),
        url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReqWtEsPSe2j4AbDsNdtOmYKaoSx4f8Q9JiA&s")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    fontFamily: "Arial, sans-serif",
    color: "white"
};

const containerStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "0 20px 40px"
};

const titleStyle = {
    fontSize: "28px",
    fontWeight: "900",
    letterSpacing: "2px",
    marginBottom: "20px",
    color: "white"
};

const backBtnStyle = {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #4caf50, #2e7d32)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "all 0.2s ease"
};

const chatBoxStyle = {
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "10px",
    height: "400px",
    overflowY: "auto",
    padding: "12px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(6px)",
    marginBottom: "12px"
};

const messageStyle = (isUser) => ({
    marginBottom: "10px",
    padding: "8px 12px",
    borderRadius: "8px",
    background: isUser ? "rgba(76,175,80,0.4)" : "rgba(33,150,243,0.4)",
    alignSelf: isUser ? "flex-end" : "flex-start",
    wordBreak: "break-word"
});

const msgTimeStyle = {
    fontSize: "0.75em",
    color: "rgba(255,255,255,0.6)",
    marginTop: "2px"
};

const inputContainerStyle = {
    display: "flex",
    gap: "8px"
};

const inputStyle = {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(0,0,0,0.25)",
    color: "white"
};

const sendBtnStyle = {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #2196f3, #1565c0)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease"
};

const toastStyle = {
    marginTop: "10px",
    color: "#ff4444",
    fontWeight: "700",
    textAlign: "center"
};

const loadingStyle = { textAlign: "center", paddingTop: "60px", color: "#4caf50", fontWeight: "700" };
const errorStyle = { textAlign: "center", paddingTop: "60px", color: "#ff4444", fontWeight: "700" };
const noDataStyle = { textAlign: "center", color: "rgba(255,255,255,0.5)", marginTop: "20px" };