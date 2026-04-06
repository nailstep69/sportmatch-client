import React, { useEffect, useState } from "react";
import { API_URL } from "../api/config";
import { useNavigate } from "react-router-dom";

export default function AdminReadyMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingMatchId, setEditingMatchId] = useState(null);
    const [scoreAInput, setScoreAInput] = useState("");
    const [scoreBInput, setScoreBInput] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReadyMatches = async () => {
            const token = localStorage.getItem("accessToken");
            try {
                const res = await fetch(`${API_URL}/Match/ready`, {
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
        fetchReadyMatches();
    }, []);

    const handleSubmit = async (matchId) => {
        const token = localStorage.getItem("accessToken");

        if (scoreAInput === "" || scoreBInput === "") {
            alert("Please fill both scores");
            return;
        }

        try {
            const res = await fetch(
                `${API_URL}/Match/finish/${matchId}?scoreA=${scoreAInput}&scoreB=${scoreBInput}`,
                {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` }
                }
            );
            if (!res.ok) throw new Error(await res.text());
            alert("Match finished successfully");

            setMatches(matches.filter(m => m.matchId !== matchId));

            setEditingMatchId(null);
            setScoreAInput("");
            setScoreBInput("");
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    if (loading) return <p>Loading ready matches...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const backgroundStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `
            linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)),
            url("https://cojo.ru/wp-content/uploads/2022/12/sportivnyi-fon-8-2.webp")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: -1
    };

    const pageStyle = {
        maxWidth: "900px",
        margin: "50px auto",
        fontFamily: "Arial",
        color: "white"
    };

    const cardStyle = {
        padding: "20px",
        marginBottom: "20px",
        borderRadius: "16px",
        background: "rgba(20, 20, 30, 0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 0 30px rgba(0,0,0,0.6)"
    };

    const buttonStyle = {
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        background: "#5865F2",
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
        marginRight: "10px",
        width: "70px"
    };

    const labelStyle = {
        opacity: 0.8,
        fontSize: "14px"
    };

    return (
        <>
            <div style={backgroundStyle}></div>

            <div style={pageStyle}>
                <button onClick={() => navigate("/matches")} style={backButton}>
                    ← Back
                </button>

                <h2 style={{ marginBottom: "20px" }}>Admin Ready Matches</h2>

                {matches.length === 0 ? (
                    <p>No ready matches</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {matches.map(match => (
                            <li key={match.matchId} style={cardStyle}>
                                <p><span style={labelStyle}>Team A:</span> <b>{match.teamA}</b></p>
                                <p><span style={labelStyle}>Team B:</span> <b>{match.teamB}</b></p>
                                <p><span style={labelStyle}>Status:</span> {match.status}</p>
                                <p><span style={labelStyle}>Date:</span> {match.date || "Not set"}</p>
                                <p><span style={labelStyle}>Location:</span> {match.location || "Not set"}</p>
                                <p><span style={labelStyle}>Score:</span> <b>{match.scoreA ?? "-"} : {match.scoreB ?? "-"}</b></p>

                                <button
                                    onClick={() => setEditingMatchId(editingMatchId === match.matchId ? null : match.matchId)}
                                    style={buttonStyle}
                                >
                                    {editingMatchId === match.matchId ? "Cancel" : "Set Score"}
                                </button>

                                {editingMatchId === match.matchId && (
                                    <div style={{ marginTop: "15px" }}>
                                        <input
                                            type="number"
                                            placeholder="A"
                                            value={scoreAInput}
                                            onChange={e => setScoreAInput(e.target.value)}
                                            style={inputStyle}
                                        />
                                        <input
                                            type="number"
                                            placeholder="B"
                                            value={scoreBInput}
                                            onChange={e => setScoreBInput(e.target.value)}
                                            style={inputStyle}
                                        />
                                        <button onClick={() => handleSubmit(match.matchId)} style={buttonStyle}>
                                            Submit
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}