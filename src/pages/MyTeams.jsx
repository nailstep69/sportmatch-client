import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { leaveTeam } from "../api/teams";
import { authFetch } from "../api/authFetch";

function getCurrentUserId() {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return parseInt(payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
    } catch {
        return null;
    }
}

export default function MyTeams() {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedTeamId, setExpandedTeamId] = useState(null);
    const [message, setMessage] = useState("");

    const currentUserId = getCurrentUserId();

    useEffect(() => {
        async function fetchTeams() {
            try {
                const res = await authFetch("/Teams/my");
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                setTeams(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchTeams();
    }, []);

    const showMessage = (text, duration = 2000) => {
        setMessage(text);
        setTimeout(() => setMessage(""), duration);
    };

    const handleToggleOpen = async (teamId) => {
        try {
            const res = await authFetch(`/Teams/${teamId}/toggle-open`, { method: "POST" });
            if (!res.ok) throw new Error(await res.text());
            const result = await res.text();
            setTeams(prev => prev.map(t => t.id === teamId ? { ...t, isOpen: !t.isOpen } : t));
            showMessage(result);
        } catch (err) { showMessage(err.message); }
    };

    const handleKick = async (teamId, userId) => {
        try {
            const res = await authFetch(`/Teams/${teamId}/kick/${userId}`, { method: "POST" });
            if (!res.ok) throw new Error(await res.text());
            const result = await res.text();
            setTeams(prev => prev.map(t => {
                if (t.id !== teamId) return t;
                return { ...t, members: t.members.filter(m => m.userId !== userId) };
            }));
            showMessage(result);
        } catch (err) { showMessage(err.message); }
    };

    const handleTransferCaptain = async (teamId, userId) => {
        try {
            const res = await authFetch(`/Teams/${teamId}/transfer-captain/${userId}`, { method: "POST" });
            if (!res.ok) throw new Error(await res.text());
            const result = await res.text();
            setTeams(prev => prev.map(t => t.id === teamId ? { ...t, captainId: userId } : t));
            showMessage(result);
        } catch (err) { showMessage(err.message); }
    };

    const handleLeave = async (teamId) => {
        try {
            const result = await leaveTeam(teamId);
            setTeams(prev => prev.filter(t => t.id !== teamId));
            showMessage(result.message || "Вы покинули команду");
        } catch (err) { showMessage(err.message); }
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

    const cardStyle = {
        padding: "18px 22px",
        marginBottom: "14px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(76,175,80,0.25)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        cursor: "pointer",
        transition: "all 0.2s ease",
    };

    const btnBase = {
        padding: "8px 14px",
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

    const btnGreen = { ...btnBase, background: "linear-gradient(135deg, #4caf50, #2e7d32)", boxShadow: "0 4px 12px rgba(76,175,80,0.3)" };
    const btnOutline = { ...btnBase, background: "transparent", border: "2px solid rgba(255,255,255,0.6)" };
    const btnOrange = { ...btnBase, background: "linear-gradient(135deg, #ff9800, #e65100)", boxShadow: "0 4px 12px rgba(255,152,0,0.3)" };
    const btnPurple = { ...btnBase, background: "linear-gradient(135deg, #9c27b0, #6a1b9a)", boxShadow: "0 4px 12px rgba(156,39,176,0.3)" };
    const btnRed = { ...btnBase, background: "linear-gradient(135deg, #f44336, #b71c1c)", boxShadow: "0 4px 12px rgba(244,67,54,0.3)" };
    const btnBlue = { ...btnBase, background: "linear-gradient(135deg, #2196f3, #0d47a1)", boxShadow: "0 4px 12px rgba(33,150,243,0.3)" };

    const notificationStyle = {
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
        textAlign: "center",
        fontWeight: "600",
        letterSpacing: "0.04em",
    };

    if (loading) return (
        <div style={{ ...pageStyle, justifyContent: "center", alignItems: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Loading...</p>
        </div>
    );

    if (error) return (
        <div style={{ ...pageStyle, justifyContent: "center", alignItems: "center" }}>
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
                        onClick={() => navigate("/teams")}
                    >
                        ← Back
                    </button>
                    <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "800", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        My Teams
                    </h2>
                </div>

                {teams.length === 0 ? (
                    <div style={cardStyle}>
                        <p style={{ textAlign: "center", fontSize: "15px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
                            You are not in any team
                        </p>
                    </div>
                ) : (
                    teams.map(team => {
                        const isExpanded = expandedTeamId === team.id;
                        return (
                            <div
                                key={team.id}
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
                                onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                                    <div>
                                        <h3 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", fontWeight: "700", letterSpacing: "0.03em" }}>
                                            {team.name}
                                        </h3>
                                        <p style={{ margin: "0", fontSize: "0.88rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.02em" }}>
                                            Sport: {team.sport} &nbsp;·&nbsp; Rating: {team.rating} &nbsp;·&nbsp;
                                            <span style={{
                                                display: "inline-block",
                                                padding: "1px 8px",
                                                borderRadius: "20px",
                                                fontSize: "0.78rem",
                                                fontWeight: "700",
                                                letterSpacing: "0.06em",
                                                textTransform: "uppercase",
                                                background: team.isOpen ? "linear-gradient(135deg, #4caf50, #2e7d32)" : "rgba(255,255,255,0.15)",
                                                color: "white",
                                                marginLeft: "4px",
                                            }}>
                                                {team.isOpen ? "Open" : "Closed"}
                                            </span>
                                        </p>
                                    </div>
                                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "18px" }}>{isExpanded ? "▲" : "▼"}</span>
                                </div>

                                <div style={{ marginTop: "14px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    <button style={btnGreen} onClick={(e) => { e.stopPropagation(); handleToggleOpen(team.id); }}>
                                        Toggle
                                    </button>
                                    <button style={btnOrange} onClick={(e) => { e.stopPropagation(); handleLeave(team.id); }}>
                                        Leave
                                    </button>
                                    {currentUserId === team.captainId && (
                                        <button style={btnPurple} onClick={(e) => { e.stopPropagation(); navigate(`/team-requests/${team.id}`, { state: { teamName: team.name } }); }}>
                                            Requests
                                        </button>
                                    )}
                                </div>

                                {isExpanded && (
                                    <div style={{ marginTop: "16px", borderTop: "1px solid rgba(76,175,80,0.2)", paddingTop: "16px" }}>
                                        <p style={{ margin: "0 0 12px 0", fontSize: "0.88rem", color: "rgba(255,255,255,0.7)" }}>
                                            Average age: <strong style={{ color: "#fff" }}>{team.averageAge}</strong>
                                        </p>
                                        <h4 style={{ margin: "0 0 10px 0", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(76,175,80,0.9)" }}>
                                            Members
                                        </h4>
                                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                                            <thead>
                                            <tr style={{ background: "rgba(76,175,80,0.12)" }}>
                                                <th style={{ textAlign: "left", padding: "10px 8px", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>Name</th>
                                                <th style={{ textAlign: "center", padding: "10px 8px", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>Age</th>
                                                <th style={{ textAlign: "left", padding: "10px 8px", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>Role</th>
                                                <th style={{ padding: "10px 8px" }}></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {team.members.map(member => (
                                                <tr key={member.userId} style={{ borderBottom: "1px solid rgba(76,175,80,0.15)" }}>
                                                    <td style={{ padding: "10px 8px", fontWeight: member.userId === team.captainId ? "700" : "400" }}>
                                                        {member.username}
                                                        {member.userId === team.captainId && (
                                                            <span style={{ marginLeft: "6px", fontSize: "10px", padding: "1px 6px", borderRadius: "10px", background: "linear-gradient(135deg, #4caf50, #2e7d32)", letterSpacing: "0.04em" }}>
                                                                    Captain
                                                                </span>
                                                        )}
                                                    </td>
                                                    <td style={{ textAlign: "center", padding: "10px 8px", color: "rgba(255,255,255,0.7)" }}>{member.age}</td>
                                                    <td style={{ padding: "10px 8px", color: "rgba(255,255,255,0.7)" }}>{member.role}</td>
                                                    <td style={{ padding: "10px 8px" }}>
                                                        {currentUserId === team.captainId && member.userId !== team.captainId && (
                                                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                                                <button style={btnRed} onClick={(e) => { e.stopPropagation(); handleKick(team.id, member.userId); }}>
                                                                    Kick
                                                                </button>
                                                                <button style={btnBlue} onClick={(e) => { e.stopPropagation(); handleTransferCaptain(team.id, member.userId); }}>
                                                                    Transfer
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {message && <div style={notificationStyle}>✓ {message}</div>}
        </div>
    );
}