import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { refreshTokenRequest } from "../api/auth";

export default function ProtectedRoute({ children }) {
    const [isAuth, setIsAuth] = useState(null);

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
                    const data = await refreshTokenRequest(rToken);
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

        void checkToken();
    }, []);

    if (isAuth === null) return null;
    if (!isAuth) return <Navigate to="/login" />;

    return children;
}