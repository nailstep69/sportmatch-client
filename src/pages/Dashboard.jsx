import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    const pageStyle = {
        minHeight: "100vh",
        paddingTop: "120px",
        backgroundImage: `
        linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.8)),
        url("https://img.freepik.com/premium-photo/football-futsal-player-ball-futsal-floor-sports-background-indoor-soccer-sports-hall-youth-futsal-league-indoor-football-players-soccer-ball-generative-ai_117038-8561.jpg")
    `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Arial, sans-serif",
        color: "white",
        position: "relative",
        overflow: "hidden"
    };

    const diagonalStyle = {
        position: "absolute",
        top: 0,
        right: 0,
        width: "60%",
        height: "100%",
        background: "linear-gradient(135deg, transparent 30%, rgba(30,144,255,0.15))",
        clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%)",
        pointerEvents: "none"
    };

    const profileBtn = {
        position: "absolute",
        top: "30px",
        right: "30px",
        width: "55px",
        height: "55px",
        borderRadius: "50%",
        border: "none",
        background: "linear-gradient(135deg, #6c5ce7, #4834d4)",
        color: "white",
        fontSize: "22px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 0 15px rgba(0,0,0,0.6)",
        transition: "0.2s"
    };

    const centerContainer = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center"
    };

    const titleStyle = {
        fontSize: "60px",
        letterSpacing: "4px",
        marginBottom: "40px"
    };

    const btnStyle = {
        padding: "25px 60px",
        fontSize: "20px",
        fontWeight: "bold",
        borderRadius: "14px",
        border: "none",
        cursor: "pointer",
        color: "white",
        background: "linear-gradient(135deg, #1e90ff, #0066ff)",
        boxShadow: "0 0 20px rgba(0,0,0,0.6)",
        transition: "0.25s",
        margin: "0 10px"
    };

    return (
        <div style={pageStyle}>
            <div style={diagonalStyle}></div>

            <button
                style={profileBtn}
                onClick={() => navigate("/profile")}
                onMouseOver={e => e.target.style.transform = "scale(1.1)"}
                onMouseOut={e => e.target.style.transform = "scale(1)"}
            >
                👤
            </button>

            <div style={centerContainer}>
                <h1 style={titleStyle}>SPORT MATCH</h1>

                <div>
                    <button
                        style={btnStyle}
                        onClick={() => navigate("/teams")}
                        onMouseOver={e => e.target.style.transform = "scale(1.05)"}
                        onMouseOut={e => e.target.style.transform = "scale(1)"}
                    >
                        TEAMS
                    </button>

                    <button
                        style={btnStyle}
                        onClick={() => navigate("/matches")}
                        onMouseOver={e => e.target.style.transform = "scale(1.05)"}
                        onMouseOut={e => e.target.style.transform = "scale(1)"}
                    >
                        MATCHES
                    </button>
                </div>
            </div>
        </div>
    );
}