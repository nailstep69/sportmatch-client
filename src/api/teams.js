import { authFetch } from "./authFetch";


export async function getAllTeams() {
    const res = await authFetch("/Teams");
    if (!res.ok) throw new Error("Ошибка при получении команд");
    return res.json();
}


export async function getTeamById(id) {
    const res = await authFetch(`/Teams/${id}`);
    if (!res.ok) throw new Error("Не удалось получить команду");
    return res.json();
}


export async function createTeam(team) {
    const res = await authFetch("/Teams", {
        method: "POST",
        body: JSON.stringify(team)
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
    }
}


export async function joinTeam(teamId) {
    const res = await authFetch(`/Teams/${teamId}/join`, { method: "POST" });
    const contentType = res.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
        data = await res.json();
    } else {
        data = { message: await res.text() };
    }

    if (!res.ok) throw new Error(data.message || "Ошибка при запросе");
    return data;
}

export async function getMyTeams() {
    const res = await authFetch("/Teams/my");
    const contentType = res.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
        data = await res.json();
    } else {
        data = { message: await res.text() };
    }

    if (!res.ok) throw new Error(data.message || "Ошибка при запросе");
    return data;
}

export async function leaveTeam(teamId) {
    const res = await authFetch(`/Teams/${teamId}/leave`, { method: "POST" });
    const contentType = res.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
        data = await res.json();
    } else {
        data = { message: await res.text() };
    }

    if (!res.ok) throw new Error(data.message || "Ошибка при выходе из команды");
    return data;
}

export async function transferCaptain(teamId, userId) {
    const res = await authFetch(`/Teams/${teamId}/transfer-captain/${userId}`, { method: "POST" });
    const contentType = res.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
        data = await res.json();
    } else {
        data = { message: await res.text() };
    }

    if (!res.ok) throw new Error(data.message || "Ошибка при передаче капитана");
    return data;
}