import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../api/authFetch"; // используем authFetch

export default function MyRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchMyRequests();
    }, []);

    async function fetchMyRequests() {
        try {
            const res = await authFetch("/Teams/my-requests");
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

    const btnStyle = {
        padding: "8px 12px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "12px",
        color: "#fff",
    };

    const pageStyle = {
        minHeight: "100vh",
        paddingTop: "120px",
        backgroundImage: `
            linear-gradient(135deg, rgba(5,7,15,0.85), rgba(11,15,42,0.9)),
            url("https://img.freepik.com/premium-photo/football-team-entering-stadium-tunnel-with-determination_1079150-228990.jpg")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        fontFamily: "Arial",
        color: "white"
    };

    const containerStyle = {
        maxWidth: "900px",
        margin: "0 auto"
    };

    const cardStyle = {
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "12px",
        background: "#1c1c1c",
        border: "1px solid rgba(255,255,255,0.2)",
        cursor: "default",
        boxShadow: "0 0 15px rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button style={{ ...btnStyle, backgroundColor: "#4caf50", marginBottom: "20px" }} onClick={() => navigate(-1)}>
                    ← Back
                </button>

                <h2 style={{ marginBottom: "20px" }}>My Join Requests</h2>

                {requests.length === 0 ? (
                    <p>You have no requests</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {requests.map((req, index) => (
                            <div key={index} style={cardStyle}>
                                <div>
                                    <p><b>Team:</b> {req.teamName}</p>
                                    <p><b>Sport:</b> {req.sportName}</p>
                                    <p><b>Status:</b> {req.status}</p>
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
                        padding: "12px 20px",
                        borderRadius: "8px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                        zIndex: 1000,
                        textAlign: "center"
                    }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}