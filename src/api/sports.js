import { authFetch } from "./authFetch";

export async function getAllSports() {
    const res = await authFetch("/Sports");

    if (!res.ok) {
        throw new Error("Ошибка при получении видов спорта");
    }

    return res.json();
}