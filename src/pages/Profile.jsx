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
        linear-gradient(135deg, rgba(5,15,10,0.92), rgba(10,25,15,0.88)),
        url("https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop")
    `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Arial, sans-serif",
        color: "white",
    };

    const cardStyle = {
        maxWidth: "600px",
        margin: "50px auto",
        padding: "30px 40px",
        borderRadius: "16px",
        background: "rgba(10, 20, 15, 0.65)",
        border: "1px solid rgba(110,220,130,0.15)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
        backdropFilter: "blur(14px)"
    };

    const titleStyle = {
        color: "#6EDC82",
        fontSize: "32px",
        marginBottom: "20px",
        textAlign: "center",
        letterSpacing: "3px",
        textTransform: "uppercase",
        textShadow: "0 0 20px rgba(110,220,130,0.3)"
    };

    const infoStyle = {
        marginBottom: "12px",
        fontSize: "15px",
        lineHeight: "1.6",
        color: "#E8F5EC",
        letterSpacing: "1px"
    };

    const teamStyle = {
        marginBottom: "10px",
        fontSize: "14px",
        padding: "10px 14px",
        borderRadius: "10px",
        background: "rgba(20, 35, 25, 0.6)",
        border: "1px solid rgba(110,220,130,0.1)",
        letterSpacing: "1px"
    };
    const btnStyle = {
        padding: "12px 28px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "13px",
        marginTop: "20px",
        marginRight: "12px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        transition: "all 0.2s"
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