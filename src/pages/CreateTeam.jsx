import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam } from "../api/teams";
import { getAllSports } from "../api/sports";

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
            await createTeam({
                name: name.trim(),
                sportId: Number(sportId)
            });

            setNotification("Команда успешно создана!");
            setTimeout(() => navigate("/teams"), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.3)",
        background: "rgba(255,255,255,0.1)",
        color: "#fff",
        outline: "none"
    };

    const btnStyle = {
        padding: "12px 20px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        background: (!name || !sportId)
            ? "rgba(200,200,200,0.6)"
            : "linear-gradient(135deg, #1e90ff, #0066ff)",
        color: "#fff",
        width: "100%",
        marginTop: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.4)"
    };

    const backBtnStyle = {
        padding: "10px 16px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        background: "linear-gradient(135deg, #ff5c5c, #d32f2f)",
        color: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.4)"
    };

    const containerStyle = {
        maxWidth: "500px",
        margin: "80px auto",
        padding: "30px",
        borderRadius: "15px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 0 20px rgba(0,0,0,0.5)",
        color: "#fff",
        fontFamily: "Arial, sans-serif"
    };

    const notificationStyle = {
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#333",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
        zIndex: 1000,
        textAlign: "center"
    };

    return (
        <div style={{
            minHeight: "100vh",
            paddingTop: "80px",
            backgroundImage: `
                linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.85)),
                url("https://img.freepik.com/premium-photo/football-team-entering-stadium-tunnel-with-determination_1079150-228990.jpg")
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
        }}>
            {notification && <div style={notificationStyle}>{notification}</div>}

            <div style={containerStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 style={{ margin: 0 }}>Создать команду</h2>
                    <button style={backBtnStyle} onClick={() => navigate("/teams")}>
                        ← Назад
                    </button>
                </div>

                <input
                    style={inputStyle}
                    placeholder="Название команды"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <select
                    style={{
                        ...inputStyle,
                        backgroundColor: "rgba(255,255,255,0.1)",
                        color: "#fff",
                        appearance: "none"
                    }}
                    value={sportId}
                    onChange={(e) => setSportId(e.target.value)}
                >
                    <option value="" disabled style={{ color: "#ccc" }}>
                        Выберите вид спорта
                    </option>
                    {sports.map(sport => (
                        <option
                            key={sport.id}
                            value={sport.id}
                            style={{ color: "#000", backgroundColor: "#fff" }} // видимые опции
                        >
                            {sport.name} (max {sport.maxPlayers})
                        </option>
                    ))}
                </select>

                {error && <p style={{ color: "#ff7777" }}>{error}</p>}

                <button
                    style={btnStyle}
                    onClick={handleCreate}
                    disabled={!name || !sportId}
                >
                    Создать
                </button>
            </div>
        </div>
    );
}