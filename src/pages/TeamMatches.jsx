import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../api/authFetch";

export default function TeamMatches() {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");

    useEffect(() => {
        async function loadMatches() {
            try {
                const res = await authFetch(`/match/${teamId}/matches`);
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || "Ошибка при загрузке матчей");
                }

                const data = await res.json();
                console.log("Fetched matches:", data); // <-- лог данных

                // Если сервер отдаёт { matches: [...] }
                if (data.matches) setMatches(data.matches);
                else setMatches(data);
            } catch (err) {
                console.error("Error loading matches:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadMatches();
    }, [teamId]);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(""), 3000);
    };

    const handleCancelMatch = async (matchId) => {
        try {
            const res = await authFetch(`/match/cancel-match/${matchId}`, { method: "POST" });

            const contentType = res.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                data = { message: await res.text() };
            }

            if (!res.ok) throw new Error(data.message || "Ошибка при отмене матча");

            showToast(data.message || "Матч отменён");
            setMatches((prev) => prev.filter((m) => m.matchId !== matchId));
        } catch (err) {
            showToast(err.message || "Не удалось отменить матч");
        }
    };

    // === Стили ===
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
        padding: "8px 12px", borderRadius: "8px", border: "none",
        cursor: "pointer", fontWeight: "bold", fontSize: "14px",
        marginBottom: "20px",
        background: "linear-gradient(135deg, #4caf50, #2e7d32)",
        color: "#fff"
    };
    const cancelBtnStyle = {
        padding: "8px 12px", borderRadius: "8px", border: "none",
        cursor: "pointer", fontWeight: "bold", fontSize: "14px",
        background: "linear-gradient(135deg, #f44336, #b71c1c)",
        color: "#fff"
    };
    const tableStyle = {
        width: "100%", borderCollapse: "collapse",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(6px)", borderRadius: "10px", overflow: "hidden"
    };
    const thStyle = { padding: "10px", borderBottom: "1px solid #eee", textAlign: "left" };
    const tdStyle = { padding: "10px", borderBottom: "1px solid #eee", textAlign: "left" };
    const centerTdStyle = { ...tdStyle, textAlign: "center" };
    const toastStyle = {
        position: "fixed", bottom: "20px", right: "20px",
        backgroundColor: "#333", color: "#fff",
        padding: "10px 20px", borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (matches.length === 0) return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button style={backBtnStyle} onClick={() => navigate(-1)}>← Back</button>
                <p>No matches found</p>
            </div>
        </div>
    );

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button style={backBtnStyle} onClick={() => navigate(-1)}>← Back</button>
                <h2>Planned Matches</h2>

                <table style={tableStyle}>
                    <thead>
                    <tr style={{ background: "rgba(255,255,255,0.15)" }}>
                        <th style={thStyle}>Team A</th>
                        <th style={thStyle}>Team B</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Location</th>
                        <th style={thStyle}>Score</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {matches.map(m => (
                        <tr key={m.matchId}>
                            <td style={tdStyle}>{m.teamA}</td>
                            <td style={tdStyle}>{m.teamB}</td>
                            <td style={centerTdStyle}>{m.status}</td>
                            <td style={tdStyle}>{m.date ?? "in progress"}</td>
                            <td style={tdStyle}>{m.location ?? "in progress"}</td>
                            <td style={centerTdStyle}>
                                {m.scoreA !== null && m.scoreB !== null ? `${m.scoreA} - ${m.scoreB}` : "in progress"}
                            </td>
                            <td style={centerTdStyle}>
                                <button style={cancelBtnStyle} onClick={() => handleCancelMatch(m.matchId)}>
                                    Cancel Match
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {toast && <div style={toastStyle}>{toast}</div>}
            </div>
        </div>
    );
}