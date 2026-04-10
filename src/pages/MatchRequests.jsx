import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTeams } from "../api/teams";

export default function MatchRequests() {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        padding: "0 20px 60px"
    };

    const btnStyle = {
        padding: "10px 22px",
        borderRadius: "8px",
        border: "none",
        background: "#4caf50",
        color: "#fff",
        fontWeight: "700",
        fontSize: "12px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        cursor: "pointer",
        marginRight: "10px",
        marginTop: "12px",
        boxShadow: "0 4px 14px rgba(76,175,80,0.3)"
    };

    const backBtnStyle = {
        padding: "10px 20px",
        borderRadius: "8px",
        border: "1px solid rgba(76,175,80,0.45)",
        background: "transparent",
        color: "#4caf50",
        fontWeight: "700",
        fontSize: "12px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        cursor: "pointer",
        marginBottom: "28px"
    };

    const cardStyle = {
        padding: "20px 24px",
        marginBottom: "16px",
        borderRadius: "12px",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(76,175,80,0.2)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)"
    };

    const teamNameStyle = {
        fontSize: "18px",
        fontWeight: "800",
        letterSpacing: "2px",
        textTransform: "uppercase",
        color: "#4caf50",
        marginBottom: "12px"
    };

    const infoTextStyle = {
        fontSize: "13px",
        color: "rgba(255,255,255,0.6)",
        letterSpacing: "1px",
        marginBottom: "4px"
    };

    const infoValueStyle = {
        color: "rgba(255,255,255,0.9)",
        fontWeight: "600"
    };

    if (loading) return (
        <div style={pageStyle}>
            <p style={{ textAlign: "center", paddingTop: "200px", color: "#4caf50", letterSpacing: "3px", fontSize: "14px" }}>
                LOADING...
            </p>
        </div>
    );

    if (error) return (
        <div style={pageStyle}>
            <p style={{ color: "#ff4444", textAlign: "center", paddingTop: "200px", letterSpacing: "1px" }}>{error}</p>
        </div>
    );

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button style={backBtnStyle} onClick={() => navigate("/matches")}>
                    ← Back
                </button>

                <h2 style={{
                    fontSize: "28px",
                    fontWeight: "900",
                    letterSpacing: "4px",
                    textTransform: "uppercase",
                    marginBottom: "24px",
                    color: "white"
                }}>
                    MY <span style={{ color: "#4caf50" }}>TEAMS</span>
                </h2>

                {teams.length === 0 ? (
                    <div style={cardStyle}>
                        <p style={{ textAlign: "center", fontSize: "14px", letterSpacing: "2px", color: "rgba(255,255,255,0.45)" }}>
                            YOU HAVE NO TEAMS
                        </p>
                    </div>
                ) : (
                    teams.map(team => (
                        <div key={team.id} style={cardStyle}>
                            <h3 style={teamNameStyle}>{team.name}</h3>

                            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", marginBottom: "4px" }}>
                                <p style={infoTextStyle}>SPORT: <span style={infoValueStyle}>{team.sport}</span></p>
                                <p style={infoTextStyle}>RATING: <span style={{ ...infoValueStyle, color: "#4caf50" }}>{team.rating}</span></p>
                                <p style={infoTextStyle}>AVG AGE: <span style={infoValueStyle}>{team.averageAge}</span></p>
                                <p style={infoTextStyle}>PLAYERS: <span style={infoValueStyle}>{team.members.length}</span></p>
                            </div>

                            <div>
                                <button style={btnStyle} onClick={() => navigate(`/match-requests/incoming/${team.id}`)}>
                                    Incoming
                                </button>
                                <button style={{ ...btnStyle, background: "transparent", border: "1px solid rgba(76,175,80,0.45)", color: "#4caf50", boxShadow: "none" }}
                                        onClick={() => navigate(`/match-requests/outgoing/${team.id}`)}>
                                    Outgoing
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}