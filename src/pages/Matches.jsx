import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTeams } from "../api/teams";
import { getAllSports } from "../api/sports";
import { authFetch } from "../api/authFetch";
import { isAdmin } from "../utils/auth";

export default function Matches() {
    const navigate = useNavigate();
    const admin = isAdmin();

    const [teams, setTeams] = useState([]);
    const [sports, setSports] = useState([]);
    const [selectedSport, setSelectedSport] = useState("");
    const [selectedRating, setSelectedRating] = useState("");
    const [expandedTeamId, setExpandedTeamId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const [teamsData, sportsData] = await Promise.all([
                    getAllTeams(),
                    getAllSports()
                ]);
                setTeams(teamsData);
                setSports(sportsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    let filteredTeams = selectedSport
        ? teams.filter(team => team.sport === selectedSport)
        : [...teams];

    if (selectedRating === "high") filteredTeams.sort((a, b) => b.rating - a.rating);
    if (selectedRating === "low") filteredTeams.sort((a, b) => a.rating - b.rating);

    const handleSendRequest = async (teamId) => {
        try {
            const res = await authFetch(`/Match/${teamId}/request`, { method: "POST" });

            const contentType = res.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                data = { message: await res.text() };
            }

            if (!res.ok) throw new Error(data.message || "Error sending request");

            setNotification("Request sent successfully!");
            setExpandedTeamId(null);
            setTimeout(() => setNotification(""), 3000);

        } catch (err) {
            setNotification(`Error: ${err.message}`);
            setTimeout(() => setNotification(""), 3000);
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
        fontFamily: "Arial, sans-serif",
        color: "white"
    };

    const containerStyle = {
        maxWidth: "900px",
        margin: "0 auto"
    };

    const btnStyle = {
        padding: "10px 14px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        color: "white",
        background: "linear-gradient(135deg, #1e90ff, #0066ff)",
        boxShadow: "0 0 15px rgba(0,0,0,0.6)"
    };

    const backBtnStyle = {
        ...btnStyle,
        background: "linear-gradient(135deg, #4caf50, #2e7d32)",
        marginBottom: "20px"
    };

    const cardStyle = {
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.2)",
        cursor: "pointer",
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

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>

                {notification && <div style={notificationStyle}>{notification}</div>}

                <button style={backBtnStyle} onClick={() => navigate("/dashboard")}>
                    ← Back
                </button>

                <h2 style={{ marginBottom: "20px" }}>Matches</h2>

                <div style={{ marginBottom: "20px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    <select
                        value={selectedSport}
                        onChange={e => setSelectedSport(e.target.value)}
                        style={{ padding: "8px", borderRadius: "6px" }}
                    >
                        <option value="">All Sports</option>
                        {sports.map(s => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedRating}
                        onChange={e => setSelectedRating(e.target.value)}
                        style={{ padding: "8px", borderRadius: "6px" }}
                    >
                        <option value="">Default</option>
                        <option value="high">High → Low</option>
                        <option value="low">Low → High</option>
                    </select>

                    <button style={btnStyle} onClick={() => navigate("/match-requests")}>
                        Requests
                    </button>

                    <button style={btnStyle} onClick={() => navigate("/current-team")}>
                        Team Matches
                    </button>

                    <button style={btnStyle} onClick={() => navigate("/match-history")}>
                        Match History
                    </button>

                    {admin && (
                        <>
                            <button style={btnStyle} onClick={() => navigate("/admin/scheduled")}>
                                Admin Scheduled
                            </button>

                            <button style={btnStyle} onClick={() => navigate("/admin/ready")}>
                                Admin Ready
                            </button>
                        </>
                    )}
                </div>

                {filteredTeams.length === 0 ? (
                    <p>No teams found</p>
                ) : (
                    filteredTeams.map(team => {
                        const isExpanded = expandedTeamId === team.id;
                        return (
                            <div
                                key={team.id}
                                style={cardStyle}
                                onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}
                            >
                                <h3>{team.name}</h3>
                                <p>Sport: {team.sport}</p>
                                <p>Rating: {team.rating}</p>
                                <p>Average age: {team.averageAge}</p>
                                <p>Players: {team.playersCount}</p>

                                {isExpanded && (
                                    <button
                                        style={{ ...btnStyle, marginTop: "10px" }}
                                        onClick={() => handleSendRequest(team.id)}
                                    >
                                        Send Request
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}