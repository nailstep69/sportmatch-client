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
        } catch (err) {
            showMessage(err.message);
        }
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
        } catch (err) {
            showMessage(err.message);
        }
    };

    const handleTransferCaptain = async (teamId, userId) => {
        try {
            const res = await authFetch(`/Teams/${teamId}/transfer-captain/${userId}`, { method: "POST" });
            if (!res.ok) throw new Error(await res.text());
            const result = await res.text();
            setTeams(prev => prev.map(t => {
                if (t.id !== teamId) return t;
                return { ...t, captainId: userId };
            }));
            showMessage(result);
        } catch (err) {
            showMessage(err.message);
        }
    };

    const handleLeave = async (teamId) => {
        try {
            const result = await leaveTeam(teamId);
            setTeams(prev => prev.filter(t => t.id !== teamId));
            showMessage(result.message || "Вы покинули команду");
        } catch (err) {
            showMessage(err.message);
        }
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
        background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 0 15px rgba(0,0,0,0.5)"
    };

    const notificationStyle = {
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
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button style={{ ...btnStyle, backgroundColor: "#4caf50", marginBottom: "20px" }} onClick={() => navigate("/teams")}>
                    ← Back
                </button>

                <h2 style={{ marginBottom: "20px" }}>My Teams</h2>

                {teams.length === 0 ? (
                    <div style={cardStyle}>
                        <p style={{ textAlign: "center", fontSize: "16px" }}>You are not in any team</p>
                    </div>
                ) : (
                    teams.map(team => {
                        const isExpanded = expandedTeamId === team.id;
                        return (
                            <div key={team.id} style={cardStyle} onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}>
                                <h3>{team.name}</h3>
                                <p>
                                    <b>Sport:</b> {team.sport} | <b>Rating:</b> {team.rating} | <b>Status:</b> {team.isOpen ? "Open" : "Closed"}
                                </p>

                                <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                    <button
                                        style={{ ...btnStyle, backgroundColor: "#4caf50" }}
                                        onClick={(e) => { e.stopPropagation(); handleToggleOpen(team.id); }}
                                    >
                                        Toggle
                                    </button>
                                    <button
                                        style={{ ...btnStyle, backgroundColor: "#ff9800" }}
                                        onClick={(e) => { e.stopPropagation(); handleLeave(team.id); }}
                                    >
                                        Leave
                                    </button>
                                    {currentUserId === team.captainId && (
                                        <button
                                            style={{ ...btnStyle, backgroundColor: "#9c27b0" }}
                                            onClick={(e) => { e.stopPropagation(); navigate(`/team-requests/${team.id}`, { state: { teamName: team.name } }); }}
                                        >
                                            Requests
                                        </button>
                                    )}
                                </div>

                                {isExpanded && (
                                    <div style={{ marginTop: "15px", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "10px" }}>
                                        <p><b>Average age:</b> {team.averageAge}</p>
                                        <h4>Members:</h4>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <thead>
                                            <tr style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                                                <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
                                                <th style={{ textAlign: "center", padding: "8px" }}>Age</th>
                                                <th style={{ textAlign: "left", padding: "8px" }}>Role</th>
                                                <th style={{ padding: "8px" }}>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {team.members.map(member => (
                                                <tr key={member.userId} style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
                                                    <td style={{ padding: "8px" }}>{member.username}</td>
                                                    <td style={{ textAlign: "center", padding: "8px" }}>{member.age}</td>
                                                    <td style={{ padding: "8px" }}>{member.role}</td>
                                                    <td style={{ padding: "8px" }}>
                                                        {currentUserId === team.captainId && member.userId !== team.captainId && (
                                                            <>
                                                                <button
                                                                    style={{ ...btnStyle, backgroundColor: "#f44336" }}
                                                                    onClick={(e) => { e.stopPropagation(); handleKick(team.id, member.userId); }}
                                                                >
                                                                    Kick
                                                                </button>
                                                                <button
                                                                    style={{ ...btnStyle, backgroundColor: "#2196f3", marginLeft: "6px" }}
                                                                    onClick={(e) => { e.stopPropagation(); handleTransferCaptain(team.id, member.userId); }}
                                                                >
                                                                    Transfer Captain
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}

                {message && <div style={notificationStyle}>{message}</div>}
            </div>
        </div>
    );
}