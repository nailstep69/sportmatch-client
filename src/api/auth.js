import { API_URL } from "./config";


export async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Ошибка при логине");
    }

    return await res.json();
}


export async function register(email, password, userName, age) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userName, age })
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Ошибка при регистрации");
    }

    return await res.json();
}


export async function refreshTokenRequest(refreshToken) {
    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
    });

    if (!res.ok) {
        throw new Error("Не удалось обновить токен");
    }

    return await res.json();
}