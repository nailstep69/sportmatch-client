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

    if (loading) return (
        <div style={pageStyle}>
            <p style={{ textAlign: "center", paddingTop: "200px", color: "#4caf50" }}>
                LOADING...
            </p>
        </div>
    );

    if (error) return (
        <div style={pageStyle}>
            <p style={{ color: "#ff4444", textAlign: "center", paddingTop: "200px" }}>{error}</p>
        </div>
    );

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

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>

                {notification && <div style={notificationStyle}>{notification}</div>}

                <button
                    style={btnGreenStyle}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back
                </button>

                <h2 style={titleStyle}>
                    MY <span style={{ color: "#4caf50" }}>MATCHES</span>
                </h2>

                <div style={{ marginBottom: "24px", display: "flex", gap: "10px", flexWrap: "wrap" }}>

                    <select value={selectedSport} onChange={e => setSelectedSport(e.target.value)} style={selectStyle}>
                        <option value="">All Sports</option>
                        {sports.map(s => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                    </select>

                    <select value={selectedRating} onChange={e => setSelectedRating(e.target.value)} style={selectStyle}>
                        <option value="">Default</option>
                        <option value="high">High → Low</option>
                        <option value="low">Low → High</option>
                    </select>

                    {[
                        { text: "Requests", path: "/match-requests" },
                        { text: "Team Matches", path: "/current-team" },
                        { text: "Match History", path: "/match-history" }
                    ].map(btn => (
                        <button
                            key={btn.text}
                            style={btnOutlineStyle}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.background = "transparent";
                            }}
                            onClick={() => navigate(btn.path)}
                        >
                            {btn.text}
                        </button>
                    ))}

                    {admin && (
                        <>
                            {["Admin Scheduled", "Admin Ready"].map((text, i) => (
                                <button
                                    key={text}
                                    style={btnOutlineStyle}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.background = "transparent";
                                    }}
                                    onClick={() => navigate(i === 0 ? "/admin/scheduled" : "/admin/ready")}
                                >
                                    {text}
                                </button>
                            ))}
                        </>
                    )}
                </div>

                {filteredTeams.map(team => {
                    const isExpanded = expandedTeamId === team.id;
                    return (
                        <div
                            key={team.id}
                            style={{
                                ...cardStyle,
                                border: isExpanded
                                    ? "1px solid rgba(76,175,80,0.4)"
                                    : "1px solid rgba(255,255,255,0.1)"
                            }}
                            onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}
                        >
                            <h3 style={teamNameStyle}>{team.name}</h3>

                            <p style={infoTextStyle}>Sport: {team.sport}</p>
                            <p style={infoTextStyle}>Rating: {team.rating}</p>
                            <p style={infoTextStyle}>Avg age: {team.averageAge}</p>
                            <p style={infoTextStyle}>Players: {team.playersCount}</p>

                            {isExpanded && (
                                <button
                                    style={btnGreenStyle}
                                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                                    onClick={e => { e.stopPropagation(); handleSendRequest(team.id); }}
                                >
                                    Send Request
                                </button>
                            )}
                        </div>
                    );
                })}
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
    color: "white"
};

const containerStyle = {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "0 20px"
};

const titleStyle = {
    fontSize: "30px",
    fontWeight: "900",
    letterSpacing: "4px",
    marginBottom: "24px"
};

const btnGreenStyle = {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    color: "white",
    background: "linear-gradient(135deg, #4caf50, #2e7d32)",
    transition: "all 0.2s ease"
};

const btnOutlineStyle = {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "2px solid rgba(255,255,255,0.7)",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    color: "white",
    background: "transparent",
    transition: "all 0.2s ease"
};

const selectStyle = {
    padding: "10px",
    borderRadius: "8px",
    background: "#111",
    color: "white"
};

const cardStyle = {
    padding: "20px",
    marginBottom: "16px",
    borderRadius: "12px",
    background: "rgba(0,0,0,0.55)"
};

const teamNameStyle = {
    fontSize: "18px",
    fontWeight: "800",
    marginBottom: "10px"
};

const infoTextStyle = {
    fontSize: "15px", // ⬅️ увеличено
    marginBottom: "4px",
    color: "#ddd"
};

const notificationStyle = {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#111",
    padding: "12px 20px",
    borderRadius: "8px",
    color: "white"
};