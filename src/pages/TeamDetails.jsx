// src/pages/TeamDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTeamById, joinTeam } from "../api/teams";
import { getProfile } from "../api/users";

export default function TeamDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [profile, setProfile] = useState(null);
    const [joinMessage, setJoinMessage] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const [teamData, profileData] = await Promise.all([
                    getTeamById(id),
                    getProfile()
                ]);
                setTeam(teamData);
                setProfile(profileData);
            } catch (err) {
                setError("Не удалось загрузить данные. Войдите снова.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id, navigate]);

    const handleJoin = async () => {
        try {
            const res = await joinTeam(team.id);
            const msg = res?.message || res || "Join request sent";
            setJoinMessage(msg);
        } catch (err) {
            setJoinMessage(err.message);
        }
    };

    if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
    if (error) return <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>{error}</p>;
    if (!team) return <p style={{ textAlign: "center", marginTop: "50px" }}>Team not found</p>;

    const isMember = profile && team.users.some(u => u.toLowerCase() === profile.username.toLowerCase());

    const btnStyle = {
        padding: "8px 15px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        backgroundColor: "#4caf50",
        color: "#fff",
        marginTop: "15px"
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

    const containerStyle = { maxWidth: "700px", margin: "0 auto", padding: "20px" };
    const cardStyle = {
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "12px",
        background: "#1c1c1c",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 0 15px rgba(0,0,0,0.5)"
    };

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button style={{ ...btnStyle, backgroundColor: "#4caf50" }} onClick={() => navigate("/teams")}>
                    ← Назад
                </button>

                <h2 style={{ color: "#4caf50", marginBottom: "20px" }}>{team.name}</h2>

                <div style={cardStyle}>
                    <p><b>Sport:</b> {team.sportType}</p>
                    <p><b>Rating:</b> {team.rating}</p>
                    <p><b>Average age:</b> {team.averageAge}</p>
                </div>

                <h3 style={{ color: "#4caf50" }}>Players:</h3>
                {team.users.length === 0 ? (
                    <p>Нет игроков</p>
                ) : (
                    <div style={cardStyle}>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {team.users.map((user, index) => (
                                <li key={index} style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
                                    {user}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {!isMember && !joinMessage && (
                    <button style={btnStyle} onClick={handleJoin}>
                        Join Team
                    </button>
                )}

                {joinMessage && <p style={{ color: "#4caf50", marginTop: "10px" }}>{joinMessage}</p>}
            </div>
        </div>
    );
}