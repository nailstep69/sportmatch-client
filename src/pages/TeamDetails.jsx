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

    if (loading) return (
        <div style={pageStyle}>
            <p style={{ textAlign: "center", paddingTop: "200px", color: "#4caf50", fontSize: "18px", letterSpacing: "2px" }}>
                LOADING...
            </p>
        </div>
    );
    if (error) return (
        <div style={pageStyle}>
            <p style={{ color: "#ff4444", textAlign: "center", paddingTop: "200px", letterSpacing: "1px" }}>{error}</p>
        </div>
    );
    if (!team) return (
        <div style={pageStyle}>
            <p style={{ textAlign: "center", paddingTop: "200px", color: "white", letterSpacing: "1px" }}>Team not found</p>
        </div>
    );

    const isMember = profile && team.users.some(u => u.toLowerCase() === profile.username.toLowerCase());

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>

                {/* Back button */}
                <button style={backBtnStyle} onClick={() => navigate("/teams")}>
                    ← НАЗАД
                </button>

                {/* Team name heading */}
                <h2 style={headingStyle}>{team.name}</h2>

                {/* Info card */}
                <div style={cardStyle}>
                    <div style={infoRowStyle}>
                        <span style={labelStyle}>SPORT</span>
                        <span style={valueStyle}>{team.sportType}</span>
                    </div>
                    <div style={dividerStyle} />
                    <div style={infoRowStyle}>
                        <span style={labelStyle}>RATING</span>
                        <span style={{ ...valueStyle, color: "#4caf50" }}>{team.rating}</span>
                    </div>
                    <div style={dividerStyle} />
                    <div style={infoRowStyle}>
                        <span style={labelStyle}>AVERAGE AGE</span>
                        <span style={valueStyle}>{team.averageAge}</span>
                    </div>
                </div>

                {/* Players section */}
                <h3 style={subHeadingStyle}>PLAYERS</h3>

                {team.users.length === 0 ? (
                    <p style={{ color: "rgb(250 229 229 / 0,5)", letterSpacing: "1px", fontSize: "14px" }}>Нет игроков</p>
                ) : (
                    <div style={cardStyle}>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {team.users.map((user, index) => (
                                <li key={index} style={playerItemStyle}>
                                    <span style={playerNumberStyle}>{String(index + 1).padStart(2, "0")}</span>
                                    <span style={{ letterSpacing: "1px" }}>{user}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Join button */}
                {!isMember && !joinMessage && (
                    <button style={joinBtnStyle} onClick={handleJoin}>
                        JOIN TEAM
                    </button>
                )}

                {joinMessage && (
                    <p style={{ color: "#4caf50", marginTop: "15px", letterSpacing: "1px", fontWeight: "bold" }}>
                        {joinMessage}
                    </p>
                )}
            </div>
        </div>
    );
}

/* ── Styles ── */
const pageStyle = {
    minHeight: "100vh",
    paddingTop: "100px",
    backgroundImage: `
        linear-gradient(135deg, rgba(0,0,0,0.75), rgba(10,30,10,0.85)),
        url("https://img.freepik.com/premium-photo/football-team-entering-stadium-tunnel-with-determination_1079150-228990.jpg")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    fontFamily: "'Arial', sans-serif",
    color: "white",
};

const containerStyle = {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "30px 20px 60px",
};

const headingStyle = {
    fontSize: "36px",
    fontWeight: "900",
    letterSpacing: "3px",
    textTransform: "uppercase",
    marginBottom: "24px",
    marginTop: "20px",
    color: "#6edc82",
    textShadow: "0 0 20px rgba(76,175,80,0.4)",
};

const subHeadingStyle = {
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: "#6edc82",
    marginTop: "30px",
    marginBottom: "12px",
};

const cardStyle = {
    padding: "0",
    marginBottom: "16px",
    borderRadius: "12px",
    background: "rgba(0, 0, 0, 0.45)",
    border: "1px solid rgba(76,175,80,0.25)",
    backdropFilter: "blur(10px)",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(76,175,80,0.1)",
};

const infoRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
};

const dividerStyle = {
    height: "1px",
    background: "rgb(238 250 238 / 0,15)",
    margin: "0 20px",
};

const labelStyle = {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "3px",
    color: "rgb(234 234 234 / 0,45)",
    textTransform: "uppercase",
};

const valueStyle = {
    fontSize: "15px",
    fontWeight: "600",
    letterSpacing: "1px",
    color: "white",
};

const playerItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "14px 20px",
    borderBottom: "1px solid rgba(76,175,80,0.12)",
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "1px",
    transition: "background 0.2s",
};

const playerNumberStyle = {
    fontSize: "12px",
    fontWeight: "700",
    color: "#6edc82",
    minWidth: "24px",
    letterSpacing: "1px",
};

const backBtnStyle = {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "1px solid rgba(76,175,80,0.5)",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "12px",
    letterSpacing: "2px",
    backgroundColor: "transparent",
    color: "#6edc82",
    textTransform: "uppercase",
    transition: "all 0.2s",
};

const joinBtnStyle = {
    marginTop: "24px",
    padding: "14px 36px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    letterSpacing: "3px",
    backgroundColor: "#49b55c",
    color: "#fff",
    textTransform: "uppercase",
    boxShadow: "0 4px 20px rgba(76,175,80,0.4)",
    transition: "all 0.2s",
};