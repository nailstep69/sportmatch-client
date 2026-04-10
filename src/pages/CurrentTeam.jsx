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

    if (loading) return <p style={loadingStyle}>Loading...</p>;
    if (error) return <p style={errorStyle}>{error}</p>;
    if (teams.length === 0)
        return (
            <div style={pageStyle}>
                <div style={containerStyle}>
                    <button style={backBtnStyle} onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                    <p style={noDataStyle}>No teams found</p>
                </div>
            </div>
        );

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button
                    style={backBtnStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <h2 style={titleStyle}>My Current Teams</h2>

                {teams.map((t) => (
                    <div key={t.id} style={cardStyle}>
                        <div>
                            <p>
                                <b>Name:</b> {t.name}
                            </p>
                            <p>
                                <b>Sport:</b> {t.sport}
                            </p>
                            <p>
                                <b>Rating:</b> {t.rating}
                            </p>
                        </div>
                        <button
                            style={matchBtnStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
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

const cardStyle = {
    padding: "16px",
    marginBottom: "14px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,0.2)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.2s ease"
};

const matchBtnStyle = {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #ff9800, #e65100)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease"
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