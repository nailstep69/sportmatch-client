import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/auth";

export default function AuthPage({ isLoggedIn, setIsLoggedIn }) {
    const [mode, setMode] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [age, setAge] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) navigate("/dashboard");
    }, [isLoggedIn, navigate]);


    useEffect(() => {
        if (!isLoggedIn) setMode(null);
    }, [isLoggedIn]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await login(email, password);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            setIsLoggedIn(true);
            navigate("/dashboard");
        } catch (err) {

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setError(err.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await register(email, password, userName, age);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            setIsLoggedIn(true);
            navigate("/dashboard");
        } catch (err) {

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setError(err.message);
        }
    };

    if (isLoggedIn) return null;

    const pageStyle = {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0b0f2a, #05070f)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        color: "white"
    };

    const cardStyle = {
        background: "rgba(20, 25, 60, 0.85)",
        padding: "40px",
        borderRadius: "16px",
        width: "380px",
        boxShadow: "0 0 25px rgba(0,0,0,0.6)",
        backdropFilter: "blur(10px)"
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        background: "#0f1535",
        color: "white",
        outline: "none"
    };

    const primaryBtn = {
        padding: "12px",
        border: "none",
        borderRadius: "8px",
        background: "#1e90ff",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "0.2s"
    };

    const secondaryBtn = {
        padding: "12px",
        border: "none",
        borderRadius: "8px",
        background: "#11152b",
        color: "white",
        cursor: "pointer",
        transition: "0.2s"
    };

    if (!mode) {
        return (
            <div style={pageStyle}>
                <div style={{ textAlign: "center" }}>
                    <h1 style={{ fontSize: "56px", marginBottom: "20px" }}>
                        SPORT MATCH
                    </h1>
                    <p style={{ color: "#aaa", marginBottom: "40px" }}>
                        Find teams. Play matches. Become champion.
                    </p>

                    <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                        <button
                            style={primaryBtn}
                            onClick={() => setMode("login")}
                            onMouseOver={e => e.target.style.background = "#3aa0ff"}
                            onMouseOut={e => e.target.style.background = "#1e90ff"}
                        >
                            Login
                        </button>

                        <button
                            style={secondaryBtn}
                            onClick={() => setMode("register")}
                            onMouseOver={e => e.target.style.background = "#1a2045"}
                            onMouseOut={e => e.target.style.background = "#11152b"}
                        >
                            Register
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    {mode === "login" ? "Login" : "Register"}
                </h2>

                <form
                    onSubmit={mode === "login" ? handleLogin : handleRegister}
                    style={{ display: "flex", flexDirection: "column", gap: "15px" }}
                >
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    {mode === "register" && (
                        <>
                            <input
                                type="text"
                                placeholder="User Name"
                                value={userName}
                                onChange={e => setUserName(e.target.value)}
                                required
                                style={inputStyle}
                            />
                            <input
                                type="number"
                                placeholder="Age"
                                value={age}
                                onChange={e => setAge(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </>
                    )}

                    <button type="submit" style={primaryBtn}>
                        {mode === "login" ? "Login" : "Register"}
                    </button>

                    <button
                        type="button"
                        style={secondaryBtn}
                        onClick={() => setMode(mode === "login" ? "register" : "login")}
                    >
                        {mode === "login" ? "Go to Register" : "Go to Login"}
                    </button>
                </form>

                {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            </div>
        </div>
    );
}