import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    const pageStyle = {
        minHeight: "100vh",
        paddingTop: "120px",
        backgroundImage: `
            linear-gradient(160deg, rgba(0,0,0,0.72) 0%, rgba(5,30,10,0.85) 100%),
            url("https://img.freepik.com/premium-photo/football-futsal-player-ball-futsal-floor-sports-background-indoor-soccer-sports-hall-youth-futsal-league-indoor-football-players-soccer-ball-generative-ai_117038-8561.jpg")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Arial, sans-serif",
        color: "white",
        position: "relative",
        overflow: "hidden"
    };

    const accentLineStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "4px",
        height: "100%",
        background: "#1a7a2e",
        pointerEvents: "none"
    };

    const diagonalStyle = {
        position: "absolute",
        top: 0,
        right: 0,
        width: "60%",
        height: "100%",
        background: "linear-gradient(135deg, transparent 30%, rgba(30,120,50,0.18))",
        clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%)",
        pointerEvents: "none"
    };

    const cornerDecoStyle = {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "180px",
        height: "180px",
        borderTop: "1.5px solid rgba(46,168,74,0.25)",
        borderLeft: "1.5px solid rgba(46,168,74,0.25)",
        pointerEvents: "none"
    };

    const profileBtn = {
        position: "absolute",
        top: "24px",
        right: "24px",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        border: "2px solid #2ea84a",
        background: "#1a7a2e",
        color: "#c6f0d0",
        fontSize: "20px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "0.2s"
    };

    const centerContainer = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center"
    };

    const badgeStyle = {
        display: "inline-block",
        fontSize: "11px",
        letterSpacing: "3px",
        color: "#4ccc6a",
        textTransform: "uppercase",
        border: "1px solid #2ea84a",
        padding: "4px 14px",
        borderRadius: "99px",
        marginBottom: "18px"
    };

    const titleStyle = {
        fontSize: "60px",
        fontWeight: "900",
        letterSpacing: "6px",
        textTransform: "uppercase",
        margin: "0 0 8px",
        lineHeight: 1
    };

    const subtitleStyle = {
        fontSize: "13px",
        color: "#7aaa86",
        letterSpacing: "2px",
        textTransform: "uppercase",
        marginBottom: "44px"
    };

    const btnPrimary = {
        padding: "16px 44px",
        fontSize: "15px",
        fontWeight: "700",
        letterSpacing: "2px",
        textTransform: "uppercase",
        borderRadius: "10px",
        border: "1.5px solid #2ea84a",
        cursor: "pointer",
        color: "#e8f9ec",
        background: "#1a7a2e",
        transition: "0.2s",
        margin: "0 8px"
    };

    const btnOutline = {
        padding: "16px 44px",
        fontSize: "15px",
        fontWeight: "700",
        letterSpacing: "2px",
        textTransform: "uppercase",
        borderRadius: "10px",
        border: "1.5px solid #2ea84a",
        cursor: "pointer",
        color: "#c6f0d0",
        background: "transparent",
        transition: "0.2s",
        margin: "0 8px"
    };

    return (
        <div style={pageStyle}>
            <div style={accentLineStyle}></div>
            <div style={diagonalStyle}></div>
            <div style={cornerDecoStyle}></div>

            <button
                style={profileBtn}
                onClick={() => navigate("/profile")}
                onMouseOver={e => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
            >
                👤
            </button>

            <div style={centerContainer}>
                <div style={badgeStyle}>Season 2025</div>
                <h1 style={titleStyle}>
                    Sport <span style={{ color: "#2ea84a" }}>Match</span>
                </h1>
                <p style={subtitleStyle}>Football management platform</p>

                <div>
                    <button
                        style={btnPrimary}
                        onClick={() => navigate("/teams")}
                        onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                        TEAMS
                    </button>

                    <button
                        style={btnOutline}
                        onClick={() => navigate("/matches")}
                        onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                        MATCHES
                    </button>
                </div>
            </div>
        </div>
    );
}