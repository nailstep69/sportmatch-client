import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/config";

export default function AddSport() {
    const [name, setName] = useState("");
    const [maxPlayers, setMaxPlayers] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!name || !maxPlayers) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("accessToken");

        try {
            const res = await fetch(`${API_URL}/Sports?name=${encodeURIComponent(name)}&maxPlayers=${parseInt(maxPlayers)}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error(await res.text());
            alert("Sport created successfully!");
            navigate("/teams"); // или куда нужно
        } catch (err) {
            console.error(err);
            setError(err.message);
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const backgroundStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `
            linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)),
            url("https://cojo.ru/wp-content/uploads/2022/12/sportivnyi-fon-8-2.webp")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: -1
    };

    const pageStyle = {
        maxWidth: "500px",
        margin: "50px auto",
        fontFamily: "Arial",
        color: "white",
        padding: "20px"
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(255,255,255,0.15)",
        color: "white"
    };

    const buttonStyle = {
        padding: "10px 20px",
        borderRadius: "10px",
        border: "none",
        background: "#5865F2",
        color: "white",
        cursor: "pointer"
    };

    return (
        <>
            <div style={backgroundStyle}></div>
            <div style={pageStyle}>
                <h2 style={{ marginBottom: "20px" }}>Add New Team</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <input
                    type="text"
                    placeholder="Team Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={inputStyle}
                />
                <input
                    type="number"
                    placeholder="Max Players"
                    value={maxPlayers}
                    onChange={e => setMaxPlayers(e.target.value)}
                    style={inputStyle}
                />
                <button onClick={handleSubmit} style={buttonStyle} disabled={loading}>
                    {loading ? "Creating..." : "Create Team"}
                </button>
            </div>
        </>
    );
}