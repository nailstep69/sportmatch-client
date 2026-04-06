import React, { useEffect, useState } from "react";
import { getAllTeams } from "../api/teams";
import { useNavigate } from "react-router-dom";

export default function Teams() {
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            const data = await getAllTeams();
            setTeams(data);
        } catch (err) {
            console.error(err);
        }
    };

    const pageStyle = {
        minHeight: "100vh",
        paddingTop: "120px",
        backgroundImage: `
            linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.8)),
            url("https://img.freepik.com/premium-photo/football-team-entering-stadium-tunnel-with-determination_1079150-228990.jpg")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        fontFamily: "Arial, sans-serif",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };

    const containerStyle = {
        maxWidth: "900px",
        width: "100%",
        margin: "0 auto",
    };

    const btnStyle = {
        padding: "10px 14px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        color: "white",
        background: "linear-gradient(135deg, #1e90ff, #0066ff)",
        boxShadow: "0 0 15px rgba(0,0,0,0.6)",
        marginBottom: "10px"
    };

    const backBtnStyle = {
        ...btnStyle,
        background: "linear-gradient(135deg, #4caf50, #2e7d32)",
        marginBottom: "10px"
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

    return (
        <div style={pageStyle}>
            <div style={containerStyle}>
                <h2 style={{ marginBottom: "20px", textAlign: "left" }}>Teams</h2>

                <div style={{ marginBottom: "25px", display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "flex-start" }}>
                    <button style={backBtnStyle} onClick={() => navigate("/dashboard")}>← Back</button>
                    <button style={btnStyle} onClick={() => navigate("/teams/create")}>Create a team</button>
                    <button style={btnStyle} onClick={() => navigate("/my-teams")}>My Teams</button>
                    <button style={btnStyle} onClick={() => navigate("/my-requests")}>My Requests</button>
                </div>

                {teams.length === 0 && <p>Teams not found</p>}

                <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                    {teams.map(team => (
                        <div
                            key={team.id}
                            onClick={() => navigate(`/teams/${team.id}`)}
                            style={cardStyle}
                        >
                            <h3>{team.name}</h3>
                            <p>Sport: {team.sport}</p>
                            <p>Rating: {team.rating}</p>
                            <p>Average age: {team.averageAge}</p>
                            <p>Players: {team.playersCount}</p>
                            <p>Status: {team.isOpen ? "Open" : "Closed"}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}