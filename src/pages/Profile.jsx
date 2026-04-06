import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/users";

export default function Profile({ setIsLoggedIn }) {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProfileData() {
            try {
                const data = await getProfile();
                setProfile(data);
            } catch (err) {
                setError("Не удалось загрузить профиль. Войдите снова.");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setIsLoggedIn(false);
                navigate("/auth");
            }
        }

        fetchProfileData();
    }, [navigate, setIsLoggedIn]);

    if (error)
        return <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>{error}</p>;
    if (!profile)
        return <p style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Profile loading...</p>;

    // Основной фон
    const pageStyle = {
        minHeight: "100vh",
        paddingTop: "120px",
        backgroundImage: `
            linear-gradient(135deg, rgba(5,7,15,0.85), rgba(11,15,42,0.95)),
            url("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Arial, sans-serif",
        color: "white",
        position: "relative",
        overflow: "hidden"
    };

    const cardStyle = {
        maxWidth: "600px",
        margin: "50px auto",
        padding: "30px 40px",
        borderRadius: "16px",
        background: "rgba(20, 25, 60, 0.85)",
        boxShadow: "0 0 25px rgba(0,0,0,0.6)",
        backdropFilter: "blur(10px)"
    };

    const titleStyle = {
        color: "#2ac9fa",
        fontSize: "32px",
        marginBottom: "20px",
        textAlign: "center"
    };

    const infoStyle = { marginBottom: "12px", fontSize: "16px", lineHeight: "1.5" };

    const teamStyle = {
        marginBottom: "8px",
        fontSize: "15px",
        padding: "8px 12px",
        borderRadius: "8px",
        background: "rgba(30, 45, 90, 0.5)"
    };

    const btnStyle = {
        padding: "12px 25px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        marginTop: "20px",
        marginRight: "15px",
        transition: "0.2s"
    };

    const leaveBtn = { ...btnStyle, background: "#df0a45", color: "white" };
    const backBtn = { ...btnStyle, background: "#1e90ff", color: "white" };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>Profile</h2>

                <p style={infoStyle}>Name: {profile.username}</p>
                <p style={infoStyle}>Email: {profile.email}</p>
                <p style={infoStyle}>Age: {profile.age}</p>

                <h3 style={{ marginTop: "20px", marginBottom: "12px" }}>Teams:</h3>
                {profile.teams.length === 0 ? (
                    <p style={infoStyle}>There is no teams</p>
                ) : (
                    profile.teams.map(t => (
                        <p key={t.id} style={teamStyle}>
                            {t.name} ({t.sportType}) — Rating: {t.rating}
                        </p>
                    ))
                )}

                <div>
                    <button
                        style={leaveBtn}
                        onMouseOver={e => (e.target.style.transform = "scale(1.05)")}
                        onMouseOut={e => (e.target.style.transform = "scale(1)")}
                        onClick={() => {
                            localStorage.removeItem("accessToken");
                            localStorage.removeItem("refreshToken");
                            setIsLoggedIn(false);
                            navigate("/auth");
                        }}
                    >
                        Leave
                    </button>

                    <button
                        style={backBtn}
                        onMouseOver={e => (e.target.style.transform = "scale(1.05)")}
                        onMouseOut={e => (e.target.style.transform = "scale(1)")}
                        onClick={() => navigate("/dashboard")}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}