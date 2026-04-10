import React, { useEffect, useState } from "react";
import { getAllTeams } from "../api/teams";
import { useNavigate } from "react-router-dom";

export default function Teams() {
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            const data = await getAllTeams();
            setTeams(data);
        } catch (err) {
            console.error(err);
        }
    };

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
        flexDirection: "column",
        alignItems: "center",
    };

    const containerStyle = {
        maxWidth: "900px",
        width: "100%",
        margin: "0 auto",
        padding: "0 20px",
    };

    const headingStyle = {
        marginBottom: "24px",
        textAlign: "left",
        fontSize: "2rem",
        fontWeight: "800",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
    };

    const btnGreenStyle = {
        padding: "10px 20px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "13px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "white",
        background: "linear-gradient(135deg, #4caf50, #2e7d32)",
        boxShadow: "0 4px 15px rgba(76, 175, 80, 0.35)",
        transition: "all 0.2s ease",
    };

    // Контурная кнопка (как "MATCHES" на скриншоте)
    const btnOutlineStyle = {
        padding: "10px 20px",
        borderRadius: "8px",
        border: "2px solid rgba(255,255,255,0.7)",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "13px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "white",
        background: "transparent",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        transition: "all 0.2s ease",
    };

    const cardStyle = {
        padding: "18px 22px",
        marginBottom: "14px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(76, 175, 80, 0.25)",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        transition: "all 0.2s ease",
    };

    const cardNameStyle = {
        margin: "0 0 10px 0",
        fontSize: "1.1rem",
        fontWeight: "700",
        letterSpacing: "0.03em",
    };

    const cardInfoStyle = {
        margin: "4px 0",
        fontSize: "0.88rem",
        color: "rgba(255,255,255,0.75)",
        letterSpacing: "0.02em",
    };

    const badgeStyle = (isOpen) => ({
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "20px",
        fontSize: "0.78rem",
        fontWeight: "700",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        background: isOpen
            ? "linear-gradient(135deg, #4caf50, #2e7d32)"
            : "rgba(255,255,255,0.15)",
        color: "white",
        marginTop: "6px",
    });

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <h2 style={headingStyle}>Teams</h2>

                <div style={{
                    marginBottom: "28px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    justifyContent: "flex-start"
                }}>
                    <button
                        style={btnGreenStyle}
                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Back
                    </button>
                    <button
                        style={btnOutlineStyle}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                        onClick={() => navigate("/teams/create")}
                    >
                        + Create a team
                    </button>
                    <button
                        style={btnOutlineStyle}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                        onClick={() => navigate("/my-teams")}
                    >
                        My Teams
                    </button>
                    <button
                        style={btnOutlineStyle}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                        onClick={() => navigate("/my-requests")}
                    >
                        My Requests
                    </button>
                </div>

                {teams.length === 0 && (
                    <p style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>
                        Teams not found
                    </p>
                )}

                <div style={{ display: "flex", flexDirection: "column" }}>
                    {teams.map(team => (
                        <div
                            key={team.id}
                            onClick={() => navigate(`/teams/${team.id}`)}
                            style={cardStyle}
                            onMouseEnter={e => {
                                e.currentTarget.style.border = "1px solid rgba(76, 175, 80, 0.6)";
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.5)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.border = "1px solid rgba(76, 175, 80, 0.25)";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)";
                            }}
                        >
                            <h3 style={cardNameStyle}>{team.name}</h3>
                            <p style={cardInfoStyle}>Sport: {team.sport}</p>
                            <p style={cardInfoStyle}>Rating: {team.rating}</p>
                            <p style={cardInfoStyle}>Average age: {team.averageAge}</p>
                            <p style={cardInfoStyle}>Players: {team.playersCount}</p>
                            <div style={badgeStyle(team.isOpen)}>
                                {team.isOpen ? "Open" : "Closed"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}