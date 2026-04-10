// src/pages/MatchHistory.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTeams } from "../api/teams";
import { authFetch } from "../api/authFetch";

export default function MatchHistory() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [expandedTeamId, setExpandedTeamId] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadTeams() {
            try {
                const data = await getMyTeams();
                setTeams(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadTeams();
    }, []);

    const handleViewHistory = async (teamId) => {
        if (expandedTeamId === teamId) {
            setExpandedTeamId(null);
            setHistory([]);
            return;
        }

        setExpandedTeamId(teamId);
        setHistoryLoading(true);

        try {
            const res = await authFetch(`/match/${teamId}/history`);
            const contentType = res.headers.get("content-type");

            let data;
            if (contentType?.includes("application/json")) {
                data = await res.json();
            } else {
                data = { message: await res.text() };
            }

            if (!res.ok) throw new Error(data.message || "Failed to load history");

            setHistory(data);
        } catch (err) {
            alert(err.message);
        } finally {
            setHistoryLoading(false);
        }
    };

    if (loading) return <p style={loadingStyle}>Loading match history...</p>;
    if (error) return <p style={errorStyle}>{error}</p>;

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button
                    style={backBtnStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    onClick={() => navigate("/matches")}
                >
                    ← Back
                </button>

                <h2 style={titleStyle}>Match History / My Teams</h2>

                {teams.length === 0 ? (
                    <p style={noDataStyle}>You are not in any teams</p>
                ) : (
                    teams.map((team) => (
                        <div key={team.id} style={cardStyle}>
                            <div>
                                <h3>{team.name}</h3>
                                <p><b>Sport:</b> {team.sport}</p>
                                <p><b>Rating:</b> {team.rating}</p>
                            </div>

                            <button
                                style={viewBtnStyle}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                                onClick={() => handleViewHistory(team.id)}
                            >
                                {expandedTeamId === team.id ? "Hide History" : "View History"}
                            </button>

                            {expandedTeamId === team.id && (
                                <div style={{ marginTop: "12px" }}>
                                    {historyLoading ? (
                                        <p style={loadingStyle}>Loading matches...</p>
                                    ) : history.length === 0 ? (
                                        <p style={noDataStyle}>No matches found</p>
                                    ) : (
                                        <table style={tableStyle}>
                                            <thead>
                                            <tr style={{ background: "rgba(255,255,255,0.15)" }}>
                                                <th style={thStyle}>Team A</th>
                                                <th style={thStyle}>Team B</th>
                                                <th style={thStyle}>Score</th>
                                                <th style={thStyle}>Date</th>
                                                <th style={thStyle}>Location</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {history.map((m) => (
                                                <tr key={m.matchId}>
                                                    <td style={tdStyle}>{m.teamA}</td>
                                                    <td style={tdStyle}>{m.teamB}</td>
                                                    <td style={centerTdStyle}>
                                                        {m.teamA} {m.scoreA} : {m.scoreB} {m.teamB}
                                                    </td>
                                                    <td style={tdStyle}>
                                                        {new Date(m.date).toLocaleString()}
                                                    </td>
                                                    <td style={tdStyle}>{m.location}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

/* ── Styles ── */

const pageStyle = {
    minHeight: "100vh",
    paddingTop: "120px",
    backgroundImage: `
        linear-gradient(135deg, rgba(0,0,0,0.75), rgba(10,30,10,0.85)),
        url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReqWtEsPSe2j4AbDsNdtOmYKaoSx4f8Q9JiA&s")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    fontFamily: "Arial, sans-serif",
    color: "white"
};

const containerStyle = {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "0 20px 40px"
};

const titleStyle = {
    fontSize: "28px",
    fontWeight: "900",
    letterSpacing: "3px",
    marginBottom: "24px",
    color: "white"
};

const backBtnStyle = {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #4caf50, #2e7d32)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "all 0.2s ease"
};

const viewBtnStyle = {
    marginTop: "10px",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #2196f3, #1565c0)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease"
};

const cardStyle = {
    padding: "16px",
    marginBottom: "14px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,0.2)",
    transition: "all 0.2s ease"
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(6px)",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "10px"
};

const thStyle = {
    padding: "10px",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    textAlign: "left",
    fontWeight: "700",
    fontSize: "13px",
    color: "rgba(255,255,255,0.7)"
};

const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.85)"
};

const centerTdStyle = {
    ...tdStyle,
    textAlign: "center",
    fontWeight: "700",
    color: "#4caf50"
};

const loadingStyle = {
    textAlign: "center",
    paddingTop: "60px",
    color: "#4caf50",
    fontWeight: "700"
};

const errorStyle = {
    textAlign: "center",
    paddingTop: "60px",
    color: "#ff4444",
    fontWeight: "700"
};

const noDataStyle = {
    textAlign: "center",
    paddingTop: "40px",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: "1px"
};