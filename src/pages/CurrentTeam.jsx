// src/pages/CurrentTeam.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTeams } from "../api/teams";

export default function CurrentTeam() {
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

    // === Стили как в прошлых файлах ===
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

    const containerStyle = {
        maxWidth: "900px",
        margin: "0 auto"
    };

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

    const cardStyle = {
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.2)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    };

    const matchBtnStyle = {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "none",
        background: "linear-gradient(135deg, #ff9800, #e65100)",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer"
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (teams.length === 0) return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button style={backBtnStyle} onClick={() => navigate(-1)}>← Back</button>
                <p>No teams found</p>
            </div>
        </div>
    );

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button style={backBtnStyle} onClick={() => navigate(-1)}>← Back</button>
                <h2>My Current Teams</h2>

                {teams.map(t => (
                    <div key={t.id} style={cardStyle}>
                        <div>
                            <p><b>Name:</b> {t.name}</p>
                            <p><b>Sport:</b> {t.sport}</p>
                            <p><b>Rating:</b> {t.rating}</p>
                        </div>
                        <button
                            style={matchBtnStyle}
                            onClick={() => navigate(`/team/${t.id}/matches`)}
                        >
                            Planned Matches
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}