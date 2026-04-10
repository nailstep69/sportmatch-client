import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { authFetch } from "../api/authFetch";

export default function TeamRequests() {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const teamName = location.state?.teamName || "Team";

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchRequests();
    }, [teamId]);

    async function fetchRequests() {
        try {
            const res = await authFetch(`/Teams/${teamId}/requests`);
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const showMessage = (text, duration = 2000) => {
        setMessage(text);
        setTimeout(() => setMessage(""), duration);
    };

    async function handleApprove(userId) {
        try {
            const res = await authFetch(`/Teams/${teamId}/approve/${userId}`, { method: "POST" });
            if (!res.ok) throw new Error(await res.text());
            setRequests(prev => prev.filter(r => r.userId !== userId));
            showMessage("Approved");
        } catch (err) {
            showMessage(err.message);
        }
    }

    async function handleReject(userId) {
        try {
            const res = await authFetch(`/Teams/${teamId}/reject/${userId}`, { method: "POST" });
            if (!res.ok) throw new Error(await res.text());
            setRequests(prev => prev.filter(r => r.userId !== userId));
            showMessage("Rejected");
        } catch (err) {
            showMessage(err.message);
        }
    }

    const pageStyle = {
        minHeight: "100vh",
        paddingTop: "120px",
        backgroundImage: `
            linear-gradient(135deg, rgba(0,0,0,0.75), rgba(10,30,10,0.85)),
            url("https://img.freepik.com/premium-photo/football-team-entering-stadium-tunnel-with-determination_1079150-228990.jpg")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
    };

    const containerStyle = {
        maxWidth: "900px",
        width: "100%",
        margin: "0 auto",
        padding: "0 20px",
    };

    const cardStyle = {
        padding: "18px 22px",
        marginBottom: "12px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(76,175,80,0.25)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        transition: "all 0.2s ease",
    };

    const btnBase = {
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "12px",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "#fff",
        transition: "all 0.2s ease",
    };

    const btnOutline = {
        ...btnBase,
        background: "transparent",
        border: "2px solid rgba(255,255,255,0.6)",
        padding: "8px 16px",
    };

    const btnGreen = {
        ...btnBase,
        background: "linear-gradient(135deg, #4caf50, #2e7d32)",
        boxShadow: "0 4px 12px rgba(76,175,80,0.3)",
    };

    const btnRed = {
        ...btnBase,
        background: "linear-gradient(135deg, #f44336, #b71c1c)",
        boxShadow: "0 4px 12px rgba(244,67,54,0.3)",
    };

    const labelStyle = {
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.5)",
        marginBottom: "2px",
    };

    const valueStyle = {
        fontSize: "14px",
        fontWeight: "600",
        color: "#fff",
    };

    if (loading) return (
        <div style={{ ...pageStyle, alignItems: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Loading...</p>
        </div>
    );

    if (error) return (
        <div style={{ ...pageStyle, alignItems: "center" }}>
            <p style={{ color: "#ff7777" }}>⚠ {error}</p>
        </div>
    );

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                    <button
                        style={btnOutline}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>
                    <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "800", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        {teamName} <span style={{ color: "#4caf50" }}>Requests</span>
                    </h2>
                </div>

                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "20px",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    background: "rgba(76,175,80,0.15)",
                    border: "1px solid rgba(76,175,80,0.3)",
                }}>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.04em" }}>Pending:</span>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#4caf50" }}>{requests.length}</span>
                </div>

                {requests.length === 0 ? (
                    <div style={{ ...cardStyle, justifyContent: "center" }}>
                        <p style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em", margin: 0 }}>
                            No pending requests
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {requests.map(req => (
                            <div
                                key={req.userId}
                                style={cardStyle}
                                onMouseEnter={e => {
                                    e.currentTarget.style.border = "1px solid rgba(76,175,80,0.6)";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.5)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.border = "1px solid rgba(76,175,80,0.25)";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)";
                                }}
                            >
                                <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
                                    <div>
                                        <p style={labelStyle}>Username</p>
                                        <p style={valueStyle}>{req.username}</p>
                                    </div>
                                    <div>
                                        <p style={labelStyle}>Request Date</p>
                                        <p style={valueStyle}>{new Date(req.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "8px" }}>
                                    <button
                                        style={btnGreen}
                                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                                        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                                        onClick={() => handleApprove(req.userId)}
                                    >
                                        ✓ Approve
                                    </button>
                                    <button
                                        style={btnRed}
                                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                                        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                                        onClick={() => handleReject(req.userId)}
                                    >
                                        ✕ Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {message && (
                <div style={{
                    position: "fixed",
                    bottom: "24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#2e7d32",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 20px rgba(76,175,80,0.4)",
                    zIndex: 1000,
                    fontWeight: "600",
                    letterSpacing: "0.04em",
                }}>
                    ✓ {message}
                </div>
            )}
        </div>
    );
}