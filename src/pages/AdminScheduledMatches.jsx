import React, { useEffect, useState } from "react";
import { API_URL } from "../api/config";
import { useNavigate } from "react-router-dom";

export default function AdminScheduledMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingMatchId, setEditingMatchId] = useState(null);
    const [dateInput, setDateInput] = useState("");
    const [locationInput, setLocationInput] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchScheduledMatches = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const res = await fetch(`${API_URL}/Match/scheduled`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                setMatches(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchScheduledMatches();
    }, []);

    const handleSubmit = async (matchId) => {
        const token = localStorage.getItem("accessToken");
        if (!dateInput || !locationInput) {
            alert("Please fill both date and location");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/Match/set-info/${matchId}?date=${encodeURIComponent(dateInput)}&location=${encodeURIComponent(locationInput)}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(await res.text());
            alert("Info set successfully");

            setMatches(matches.filter(m => m.matchId !== matchId));

            setEditingMatchId(null);
            setDateInput("");
            setLocationInput("");
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    if (loading) return <p>Loading scheduled matches...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const pageStyle = {
        maxWidth: "900px",
        margin: "50px auto",
        fontFamily: "Arial",
        color: "white"
    };

    const backgroundStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `
        linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.5)),
        url("https://cojo.ru/wp-content/uploads/2022/12/sportivnyi-fon-8-2.webp")
    `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: -1
    };

    const overlayStyle = {
        background: "rgba(0,0,0,0.65)",
        minHeight: "100vh",
        padding: "30px"
    };

    const cardStyle = {
        padding: "20px",
        marginBottom: "20px",
        borderRadius: "14px",
        background: "rgba(0,0,0,0.45)",   // ТЕМНОЕ СТЕКЛО
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.15)",
        boxShadow: "0 0 25px rgba(0,0,0,0.5)"
    };

    const buttonStyle = {
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        background: "#4f6ef7",
        color: "white",
        marginTop: "10px",
        marginRight: "10px"
    };

    const backButton = {
        padding: "8px 16px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        background: "#6cc070",
        color: "white",
        marginBottom: "20px"
    };

    const inputStyle = {
        padding: "8px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(255,255,255,0.15)",
        color: "white",
        marginRight: "10px"
    };

    const labelStyle = {
        opacity: 0.8,
        fontSize: "14px"
    };

    return (
        <div style={backgroundStyle}>
            <div style={overlayStyle}>
                <div style={pageStyle}>
                    <button onClick={() => navigate("/matches")} style={backButton}>
                        ← Back
                    </button>

                    <h2 style={{ marginBottom: "20px" }}>Admin Scheduled Matches</h2>

                    {matches.length === 0 ? (
                        <p>No scheduled matches</p>
                    ) : (
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {matches.map(match => (
                                <li key={match.matchId} style={cardStyle}>
                                    <p><span style={labelStyle}>Team A:</span> <b>{match.teamA}</b></p>
                                    <p><span style={labelStyle}>Team B:</span> <b>{match.teamB}</b></p>
                                    <p><span style={labelStyle}>Status:</span> {match.status}</p>
                                    <p><span style={labelStyle}>Date:</span> {match.date || "Not set"}</p>
                                    <p><span style={labelStyle}>Location:</span> {match.location || "Not set"}</p>
                                    <p>
                                        <span style={labelStyle}>Score:</span>{" "}
                                        <b>{match.scoreA ?? "-"}</b> : <b>{match.scoreB ?? "-"}</b>
                                    </p>

                                    <button
                                        onClick={() => setEditingMatchId(editingMatchId === match.matchId ? null : match.matchId)}
                                        style={buttonStyle}
                                    >
                                        {editingMatchId === match.matchId ? "Cancel" : "Set Info"}
                                    </button>

                                    {editingMatchId === match.matchId && (
                                        <div style={{ marginTop: "15px" }}>
                                            <input
                                                type="datetime-local"
                                                value={dateInput}
                                                onChange={e => setDateInput(e.target.value)}
                                                style={inputStyle}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Location"
                                                value={locationInput}
                                                onChange={e => setLocationInput(e.target.value)}
                                                style={inputStyle}
                                            />
                                            <button
                                                onClick={() => handleSubmit(match.matchId)}
                                                style={buttonStyle}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}