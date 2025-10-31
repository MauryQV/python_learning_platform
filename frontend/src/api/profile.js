import api from "./axiosInstance";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:2999").replace(/\/$/, "");

const resolveUrl = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

const normalizeUser = (u = {}) => {
  const profileImage = resolveUrl(u.profileImage || u.avatarUrl || "");
  const avatarUrl = resolveUrl(u.avatarUrl || u.profileImage || "");

  const name =
    u.name ||
    (u.firstName || u.lastName
      ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
      : "");

  return {
    ...u,
    name,
    firstName: u.firstName || "",
    lastName: u.lastName || "",
    profileImage,
    avatarUrl,
  };
};


export const profileApi = {
  async me() {
    const res = await api.get("/profile/me");
    return normalizeUser(res.data);
  },
  async getMe() {
    const res = await api.get("/profile/me");
    return normalizeUser(res.data);
  },
  async update(data) {
    const res = await api.put("/profile", data);
    return normalizeUser(res.data);
  },
  async uploadAvatar(file) {
    const form = new FormData();
    form.append("avatar", file);
    const res = await api.post("/profile/avatar", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const url = resolveUrl(res.data?.url || "");
    return { url };
  },
};
