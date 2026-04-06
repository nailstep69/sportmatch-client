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
            linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.8)),
            url("https://img.freepik.com/premium-photo/football-team-entering-stadium-tunnel-with-determination_1079150-228990.jpg")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        fontFamily: "Arial, sans-serif",
        color: "white",
        display: "flex",
        justifyContent: "center"
    };

    const containerStyle = {
        maxWidth: "900px",
        width: "100%",
        margin: "0 auto"
    };

    const cardStyle = {
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "12px",
        background: "#1e1e2f",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 0 15px rgba(0,0,0,0.5)"
    };

    const btnStyle = {
        padding: "8px 14px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        color: "#fff",
        marginRight: "6px"
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button
                    style={{ ...btnStyle, backgroundColor: "#4caf50", marginBottom: "20px" }}
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <h2 style={{ marginBottom: "20px" }}>{teamName} Team Requests</h2>

                <p><b>Pending Requests:</b> {requests.length}</p>

                {requests.length === 0 ? (
                    <p>No pending requests</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {requests.map(req => (
                            <div
                                key={req.userId}
                                style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                            >
                                <div>
                                    <p><b>Username:</b> {req.username}</p>
                                    <p><b>Request Date:</b> {new Date(req.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <button
                                        style={{ ...btnStyle, backgroundColor: "#4caf50" }}
                                        onClick={() => handleApprove(req.userId)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        style={{ ...btnStyle, backgroundColor: "#f44336" }}
                                        onClick={() => handleReject(req.userId)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {message && (
                    <div style={{
                        position: "fixed",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#333",
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        zIndex: 999
                    }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}