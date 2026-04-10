import { authFetch } from "./authFetch";

export async function getProfile() {
    const res = await authFetch("/users/profile");

    if (!res.ok) {
        throw new Error("Ошибка при получении профиля");
    }

    return res.json();
}