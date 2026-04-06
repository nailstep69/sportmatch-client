import { API_URL } from "./config";

export async function authFetch(url, options = {}) {
    let accessToken = localStorage.getItem("accessToken");

    options.headers = {
        ...(options.headers || {}),
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
    };

    let response = await fetch(API_URL + url, options);

    if (response.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            localStorage.removeItem("accessToken");
            window.location.href = "/";
            return;
        }

        const refreshResponse = await fetch(`${API_URL}/Auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        });

        if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);


            options.headers["Authorization"] = `Bearer ${data.accessToken}`;
            response = await fetch(API_URL + url, options);
        } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/";
            return;
        }
    }

    return response;
}