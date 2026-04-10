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
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                setMatches(data.matches || data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadMatches();
    }, [teamId]);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    };

    const handleCancelMatch = async (matchId) => {
        try {
            const res = await authFetch(`/match/cancel-match/${matchId}`, { method: "POST" });
            const data = res.headers.get("content-type")?.includes("json") ? await res.json() : { message: await res.text() };
            if (!res.ok) throw new Error(data.message || "Ошибка");
            showToast(data.message || "Матч отменён");
            setMatches(prev => prev.filter(m => m.matchId !== matchId));
        } catch (err) {
            showToast(err.message);
        }
    };

    if (loading) return (
        <div style={pageStyle}>
            <p style={{ textAlign: "center", paddingTop: "200px", color: "#4caf50", letterSpacing: "3px", fontSize: "14px" }}>LOADING...</p>
        </div>
    );
    if (error) return (
        <div style={pageStyle}>
            <p style={{ color: "#ff4444", textAlign: "center", paddingTop: "200px", letterSpacing: "1px" }}>{error}</p>
        </div>
    );
    if (matches.length === 0) return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button style={backBtnStyle} onClick={() => navigate(-1)}>← Back</button>
                <p style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "2px", fontSize: "13px" }}>NO MATCHES FOUND</p>
            </div>
        </div>
    );

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button style={backBtnStyle} onClick={() => navigate(-1)}>← Back</button>

                <h2 style={titleStyle}>
                    PLANNED <span style={{ color: "#4caf50" }}>MATCHES</span>
                </h2>

                <div style={tableWrapper}>
                    <table style={tableStyle}>
                        <thead>
                        <tr style={{ background: "rgba(76,175,80,0.08)" }}>
                            <th style={thStyle}>TEAM A</th>
                            <th style={thStyle}>TEAM B</th>
                            <th style={thStyle}>STATUS</th>
                            <th style={thStyle}>DATE</th>
                            <th style={thStyle}>LOCATION</th>
                            <th style={{ ...thStyle, textAlign: "center" }}>SCORE</th>
                            <th style={{ ...thStyle, textAlign: "center" }}>ACTIONS</th>
                        </tr>
                        </thead>
                        <tbody>
                        {matches.map((m, i) => (
                            <tr key={m.matchId} style={{ background: i % 2 === 0 ? "rgba(0,0,0,0.2)" : "transparent" }}>
                                <td style={tdStyle}>{m.teamA}</td>
                                <td style={tdStyle}>{m.teamB}</td>
                                <td style={tdStyle}>
                                    <span style={statusBadgeStyle}>{m.status}</span>
                                </td>
                                <td style={tdStyle}>{m.date ?? "—"}</td>
                                <td style={tdStyle}>{m.location ?? "—"}</td>
                                <td style={{ ...tdStyle, textAlign: "center", color: "#4caf50", fontWeight: "700", letterSpacing: "2px" }}>
                                    {m.scoreA !== null && m.scoreB !== null ? `${m.scoreA} — ${m.scoreB}` : "—"}
                                </td>
                                <td style={{ ...tdStyle, textAlign: "center" }}>
                                    <button style={cancelBtnStyle} onClick={() => handleCancelMatch(m.matchId)}>Cancel</button>
                                    <button style={chatBtnStyle} onClick={() => navigate(`/match-chat/${m.matchId}`)}>Chat</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {toast && <div style={toastStyle}>{toast}</div>}
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
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "0 20px 60px"
};

const titleStyle = {
    fontSize: "28px",
    fontWeight: "900",
    letterSpacing: "4px",
    textTransform: "uppercase",
    marginBottom: "24px",
    marginTop: "4px",
    color: "white"
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
    marginBottom: "24px"
};

const tableWrapper = {
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid rgba(76,175,80,0.2)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)"
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(10px)"
};

const thStyle = {
    padding: "13px 14px",
    borderBottom: "1px solid rgba(76,175,80,0.2)",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "2px",
    color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase"
};

const tdStyle = {
    padding: "13px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: "13px",
    color: "rgba(255,255,255,0.85)",
    letterSpacing: "0.5px"
};

const statusBadgeStyle = {
    padding: "3px 10px",
    borderRadius: "20px",
    background: "rgba(76,175,80,0.15)",
    border: "1px solid rgba(76,175,80,0.3)",
    color: "#4caf50",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase"
};

const cancelBtnStyle = {
    padding: "7px 14px",
    borderRadius: "7px",
    border: "1px solid rgba(244,67,54,0.4)",
    background: "transparent",
    color: "rgba(244,67,54,0.8)",
    fontWeight: "700",
    fontSize: "11px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    cursor: "pointer",
    marginRight: "6px"
};

const chatBtnStyle = {
    padding: "7px 14px",
    borderRadius: "7px",
    border: "none",
    background: "#4caf50",
    color: "#fff",
    fontWeight: "700",
    fontSize: "11px",
    letterSpacing: "1px",
    textTransform: "uppercase",
    cursor: "pointer",
    boxShadow: "0 3px 10px rgba(76,175,80,0.3)"
};

const toastStyle = {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    background: "rgba(0,0,0,0.85)",
    border: "1px solid rgba(76,175,80,0.35)",
    color: "#4caf50",
    padding: "12px 22px",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    zIndex: 1000,
    letterSpacing: "1px",
    fontSize: "13px",
    fontWeight: "600"
};