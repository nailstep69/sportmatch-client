import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { refreshToken } from "../api/auth";

export default function ProtectedRoute({ children }) {
    const [isAuth, setIsAuth] = useState(null); // null = проверка, true/false = результат

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("accessToken");
            const rToken = localStorage.getItem("refreshToken");

            if (token) {
                setIsAuth(true);
                return;
            }

            if (rToken) {
                try {
                    const data = await refreshToken(rToken);
                    localStorage.setItem("accessToken", data.accessToken);
                    setIsAuth(true);
                    return;
                } catch {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                }
            }

            setIsAuth(false);
        };

        checkToken();
    }, []);

    if (isAuth === null) return null; // пока проверяем токен
    if (!isAuth) return <Navigate to="/login" />;

    return children;
}