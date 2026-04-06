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
            if (contentType && contentType.includes("application/json")) {
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

    const pageStyle = {
        minHeight: "100vh",
        paddingTop: "120px",
        backgroundImage: `
            linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.8)),
            url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReqWtEsPSe2j4AbDsNdtOmYKaoSx4f8Q9JiA&s")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "white",
        fontFamily: "Arial"
    };

    const containerStyle = { maxWidth: "900px", margin: "0 auto" };

    const backBtnStyle = {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        marginBottom: "20px",
        background: "linear-gradient(135deg, #4caf50, #2e7d32)",
        color: "#fff"
    };

    const viewBtnStyle = {
        marginTop: "10px",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "none",
        background: "linear-gradient(135deg, #2196f3, #1565c0)",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer"
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

    const thStyle = { padding: "10px", borderBottom: "1px solid #eee", textAlign: "left" };
    const tdStyle = { padding: "10px", borderBottom: "1px solid #eee", textAlign: "left" };
    const centerTdStyle = { ...tdStyle, textAlign: "center" };

    if (loading) return <p>Loading match history...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button style={backBtnStyle} onClick={() => navigate("/matches")}>← Back</button>
                <h2>Match History / My Teams</h2>

                {teams.length === 0 ? (
                    <p>You are not in any teams</p>
                ) : (
                    teams.map(team => (
                        <div
                            key={team.id}
                            style={{
                                padding: "15px",
                                marginBottom: "15px",
                                borderRadius: "10px",
                                background: "rgba(255,255,255,0.08)",
                                backdropFilter: "blur(6px)"
                            }}
                        >
                            <h3>{team.name}</h3>
                            <p>Sport: {team.sport}</p>
                            <p>Rating: {team.rating}</p>

                            <button
                                onClick={() => handleViewHistory(team.id)}
                                style={viewBtnStyle}
                            >
                                {expandedTeamId === team.id ? "Hide History" : "View History"}
                            </button>

                            {expandedTeamId === team.id && (
                                <div>
                                    {historyLoading ? (
                                        <p>Loading matches...</p>
                                    ) : history.length === 0 ? (
                                        <p>No matches found</p>
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
                                            {history.map(m => (
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