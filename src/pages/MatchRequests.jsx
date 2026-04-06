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
        background: "linear-gradient(135deg, #4caf50, #2e7d32)",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        marginRight: "10px",
        marginBottom: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)"
    };

    const backBtnStyle = {
        padding: "10px 14px",
        borderRadius: "10px",
        border: "none",
        background: "linear-gradient(135deg, #1e90ff, #0066ff)",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        marginBottom: "20px",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)"
    };

    const cardStyle = {
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 0 15px rgba(0,0,0,0.5)"
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button style={backBtnStyle} onClick={() => navigate("/matches")}>
                    ← Back
                </button>

                <h2 style={{ marginBottom: "20px" }}>My Teams</h2>

                {teams.length === 0 ? (
                    <div style={cardStyle}>
                        <p style={{ textAlign: "center", fontSize: "16px" }}>You have no teams</p>
                    </div>
                ) : (
                    teams.map(team => (
                        <div key={team.id} style={cardStyle}>
                            <h3>{team.name}</h3>
                            <p>Sport: {team.sport}</p>
                            <p>Rating: {team.rating}</p>
                            <p>Average age: {team.averageAge}</p>
                            <p>Players: {team.members.length}</p>

                            <div>
                                <button
                                    style={btnStyle}
                                    onClick={() => navigate(`/match-requests/incoming/${team.id}`)}
                                >
                                    Incoming
                                </button>
                                <button
                                    style={btnStyle}
                                    onClick={() => navigate(`/match-requests/outgoing/${team.id}`)}
                                >
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