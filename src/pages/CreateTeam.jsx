import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam } from "../api/teams";
import { getAllSports } from "../api/sports";
import { isAdmin } from "../utils/auth";

export default function CreateTeam() {
    const [name, setName] = useState("");
    const [sports, setSports] = useState([]);
    const [sportId, setSportId] = useState("");
    const [error, setError] = useState("");
    const [notification, setNotification] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadSports();
    }, []);

    const loadSports = async () => {
        try {
            const data = await getAllSports();
            setSports(data);
        } catch (err) {
            console.error(err);
            setError("Не удалось загрузить виды спорта");
        }
    };

    const handleCreate = async () => {
        if (!name.trim()) {
            setError("Введите название команды");
            return;
        }
        if (!sportId) {
            setError("Выберите вид спорта");
            return;
        }
        try {
            await createTeam({ name: name.trim(), sportId: Number(sportId) });
            setNotification("Команда успешно создана!");
            setTimeout(() => navigate("/teams"), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    const isReady = name.trim() && sportId;

    const inputStyle = {
        width: "100%",
        padding: "12px 14px",
        marginBottom: "15px",
        borderRadius: "8px",
        border: "1px solid rgba(76, 175, 80, 0.3)",
        background: "rgba(255,255,255,0.07)",
        color: "#fff",
        outline: "none",
        fontSize: "14px",
        letterSpacing: "0.03em",
        boxSizing: "border-box",
        transition: "border 0.2s ease",
    };

    const btnStyle = {
        padding: "12px 20px",
        borderRadius: "8px",
        border: "none",
        cursor: isReady ? "pointer" : "not-allowed",
        fontWeight: "700",
        fontSize: "13px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        background: isReady
            ? "linear-gradient(135deg, #4caf50, #2e7d32)"
            : "rgba(255,255,255,0.15)",
        color: "#fff",
        width: "100%",
        marginTop: "10px",
        boxShadow: isReady ? "0 4px 15px rgba(76, 175, 80, 0.35)" : "none",
        transition: "all 0.2s ease",
    };

    const backBtnStyle = {
        padding: "10px 18px",
        borderRadius: "8px",
        border: "2px solid rgba(255,255,255,0.7)",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "13px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "white",
        background: "transparent",
        transition: "all 0.2s ease",
    };

    const addSportBtnStyle = {
        ...backBtnStyle,
        background: "rgba(76, 175, 80, 0.8)",
        color: "#fff",
        border: "none",
    };

    const containerStyle = {
        maxWidth: "500px",
        margin: "80px auto",
        padding: "32px",
        borderRadius: "14px",
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(76, 175, 80, 0.25)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        color: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    };

    const notificationStyle = {
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#2e7d32",
        color: "#fff",
        padding: "12px 24px",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(76, 175, 80, 0.4)",
        zIndex: 1000,
        textAlign: "center",
        fontWeight: "600",
        letterSpacing: "0.04em",
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                paddingTop: "80px",
                backgroundImage: `
                linear-gradient(135deg, rgba(0,0,0,0.75), rgba(10,30,10,0.85)),
                url("https://img.freepik.com/premium-photo/football-team-entering-stadium-tunnel-with-determination_1079150-228990.jpg")
            `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            {notification && <div style={notificationStyle}>✓ {notification}</div>}

            <div style={containerStyle}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "24px",
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "1.6rem",
                            fontWeight: "800",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                        }}
                    >
                        Create a Team
                    </h2>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            style={backBtnStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                            onClick={() => navigate("/teams")}
                        >
                            ← Back
                        </button>

                        {isAdmin() && (
                            <button
                                style={addSportBtnStyle}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                                onClick={() => navigate("/add-sport")}
                            >
                                Add Sport
                            </button>
                        )}
                    </div>
                </div>

                <input
                    style={inputStyle}
                    placeholder="Название команды"
                    value={name}
                    onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(76, 175, 80, 0.7)")}
                    onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(76, 175, 80, 0.3)")}
                    onChange={(e) => {
                        setName(e.target.value);
                        setError("");
                    }}
                />

                <select
                    style={{
                        ...inputStyle,
                        appearance: "none",
                        cursor: "pointer",
                    }}
                    value={sportId}
                    onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(76, 175, 80, 0.7)")}
                    onBlur={(e) => (e.currentTarget.style.border = "1px solid rgba(76, 175, 80, 0.3)")}
                    onChange={(e) => {
                        setSportId(e.target.value);
                        setError("");
                    }}
                >
                    <option value="" disabled style={{ color: "#ccc", background: "#1a1a1a" }}>
                        Select a sport
                    </option>
                    {sports.map((sport) => (
                        <option
                            key={sport.id}
                            value={sport.id}
                            style={{ color: "#fff", backgroundColor: "#1a2e1a" }}
                        >
                            {sport.name} (max {sport.maxPlayers})
                        </option>
                    ))}
                </select>

                {error && (
                    <p
                        style={{
                            color: "#ff7777",
                            fontSize: "13px",
                            margin: "-8px 0 12px 0",
                            letterSpacing: "0.02em",
                        }}
                    >
                        ⚠ {error}
                    </p>
                )}

                <button
                    style={btnStyle}
                    onClick={handleCreate}
                    disabled={!isReady}
                    onMouseEnter={(e) => {
                        if (isReady) e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                    }}
                >
                    Create
                </button>
            </div>
        </div>
    );
}