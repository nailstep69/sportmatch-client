import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../api/authFetch";

export default function IncomingRequests() {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadRequests() {
        try {
            const res = await authFetch(`/Match/${teamId}/incoming`);
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

    async function acceptRequest(requestId) {
        try {
            const res = await authFetch(`/Match/accept/${requestId}`, { method: "POST" });
            if (!res.ok) throw new Error(await res.text());
            await loadRequests();
        } catch (err) {
            alert(err.message);
        }
    }

    async function declineRequest(requestId) {
        try {
            const res = await authFetch(`/Match/decline/${requestId}`, { method: "POST" });
            if (!res.ok) throw new Error(await res.text());
            await loadRequests();
        } catch (err) {
            alert(err.message);
        }
    }

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

    const btnStyle = {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "none",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        marginRight: "5px"
    };

    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(6px)",
        borderRadius: "10px",
        overflow: "hidden"
    };

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <button
                    style={{ ...btnStyle, background: "linear-gradient(135deg, #4caf50, #2e7d32)", marginBottom: "20px" }}
                    onClick={() => navigate("/match-requests")}
                >
                    ← Back
                </button>

                <h2>Incoming Requests</h2>

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {!loading && !error && requests.length === 0 && <p>No incoming requests</p>}

                {!loading && !error && requests.length > 0 && (
                    <table style={tableStyle}>
                        <thead>
                        <tr style={{ background: "rgba(255,255,255,0.15)" }}>
                            <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #eee" }}>From Team</th>
                            <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #eee" }}>To Team</th>
                            <th style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #eee" }}>Status</th>
                            <th style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #eee" }}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requests.map(req => (
                            <tr key={req.requestId}>
                                <td style={{ padding: "10px" }}>{req.fromTeamName}</td>
                                <td style={{ padding: "10px" }}>{req.toTeamName}</td>
                                <td style={{ padding: "10px", textAlign: "center" }}>{req.status}</td>
                                <td style={{ padding: "10px", textAlign: "center" }}>
                                    <button
                                        style={{ ...btnStyle, background: "linear-gradient(135deg, #4caf50, #2e7d32)" }}
                                        onClick={() => acceptRequest(req.requestId)}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        style={{ ...btnStyle, background: "linear-gradient(135deg, #f44336, #b71c1c)" }}
                                        onClick={() => declineRequest(req.requestId)}
                                    >
                                        Decline
                                    </button>
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