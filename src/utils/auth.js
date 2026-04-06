export function getTokenPayload() {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

export function getUserRole() {
    const payload = getTokenPayload();
    return payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
}

export function getUserId() {
    const payload = getTokenPayload();
    return payload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
}

export function isAdmin() {
    return getUserRole() === "Admin";
}