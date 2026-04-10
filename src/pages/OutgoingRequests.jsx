import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../api/authFetch";

export default function OutgoingRequests() {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadRequests() {
        try {
            const res = await authFetch(`/Match/${teamId}/outgoing`);
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRequests();
    }, [teamId]);

    async function cancelRequest(requestId) {
        try {
            const res = await authFetch(`/Match/cancel/${requestId}`, { method: "POST" });
            if (!res.ok) throw new Error(await res.text());
            await loadRequests();
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button
                    style={btnGreenStyle}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    onClick={() => navigate("/match-requests")}
                >
                    ← Back
                </button>

                <h2 style={titleStyle}>
                    OUTGOING <span style={{ color: "#4caf50" }}>REQUESTS</span>
                </h2>

                {loading && <p style={loadingStyle}>LOADING...</p>}
                {error && <p style={errorStyle}>{error}</p>}
                {!loading && !error && requests.length === 0 && <p style={noDataStyle}>No outgoing requests</p>}

                {!loading && !error && requests.length > 0 && (
                    <table style={tableStyle}>
                        <thead>
                        <tr style={tableHeaderRowStyle}>
                            <th style={tableHeaderCellStyle}>From Team</th>
                            <th style={tableHeaderCellStyle}>To Team</th>
                            <th style={tableHeaderCellStyle}>Status</th>
                            <th style={tableHeaderCellStyle}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requests.map(req => (
                            <tr key={req.requestId} style={tableRowStyle}>
                                <td style={tableCellStyle}>{req.fromTeamName}</td>
                                <td style={tableCellStyle}>{req.toTeamName}</td>
                                <td style={{ ...tableCellStyle, textAlign: "center" }}>{req.status}</td>
                                <td style={{ ...tableCellStyle, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    {req.status === "Pending" && (
                                        <button
                                            style={btnOrangeStyle}
                                            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                                            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                                            onClick={() => cancelRequest(req.requestId)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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
    color: "white",
    fontFamily: "Arial"
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

const loadingStyle = {
    textAlign: "center",
    paddingTop: "40px",
    color: "#4caf50"
};

const errorStyle = {
    textAlign: "center",
    paddingTop: "40px",
    color: "#ff4444"
};

const noDataStyle = {
    textAlign: "center",
    paddingTop: "20px",
    color: "#ddd"
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
    marginRight: "8px",
    transition: "all 0.2s ease"
};

const btnOrangeStyle = {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    color: "white",
    background: "linear-gradient(135deg, #ff9800, #e65100)",
    transition: "all 0.2s ease"
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(0,0,0,0.55)",
    borderRadius: "12px",
    overflow: "hidden",
    marginTop: "20px"
};

const tableHeaderRowStyle = {
    background: "rgba(255,255,255,0.1)"
};

const tableHeaderCellStyle = {
    padding: "12px",
    textAlign: "left",
    fontWeight: "700",
    fontSize: "14px",
    borderBottom: "1px solid rgba(255,255,255,0.2)"
};

const tableRowStyle = {
    borderBottom: "1px solid rgba(255,255,255,0.1)"
};

const tableCellStyle = {
    padding: "12px",
    fontSize: "14px",
    color: "#ddd"
};