import api from "@/api/axiosInstance";

export const profileApi = {
  me: async () => {
    const { data } = await api.get("/profile");
    return data;
  },

  update: async (payload) => {
    const { data } = await api.put("/profile", payload);
    return data;
  },

  uploadAvatar: async (file, onProgress) => {
    const form = new FormData();
    form.append("avatar", file);

    const { data } = await api.post("/profile/avatar", form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          const pct = Math.round((evt.loaded * 100) / evt.total);
          onProgress(pct);
        }
      },
    });
    return data;
  },
};
