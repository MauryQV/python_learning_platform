import { useCallback, useEffect, useMemo, useState } from "react";
import { LIMITS } from "@/shared/config/limits";
import { profileApi } from "@/api/profile"; 
import { useAuth } from "@/context/AuthContext";

export function useProfileModel() {
  const { user } = useAuth();

  const normalizeUser = (u) => {
    if (!u || typeof u !== "object") {
      return {
        name: "",
        role: "Software Developer",
        email: "",
        bio: "Bio",
        profileImage: "",
        avatarUrl: "",
        birthday: "",
        gender: "",
        profession: "",
        goals: ["Texto"],
        skills: [
          { label: "Software", value: 80 },
          { label: "Mobile App", value: 70 },
          { label: "Full Stack", value: 90 },
        ],
      };
    }
    const profileImage = u.profileImage || u.avatarUrl || "";
    const avatarUrl = u.avatarUrl || u.profileImage || "";
    return {
      name: u.name || "",
      role: u.role || "Software Developer",
      email: u.email || "",
      bio: u.bio || "Bio",
      profileImage,
      avatarUrl,
      birthday: u.birthday || "",
      gender: u.gender || "",
      profession: u.profession || "",
      goals: Array.isArray(u.goals) ? u.goals : ["Texto"],
      skills:
        Array.isArray(u.skills) && u.skills.length
          ? u.skills
          : [
              { label: "Software", value: 80 },
              { label: "Mobile App", value: 70 },
              { label: "Full Stack", value: 90 },
            ],
    };
  };

  const [initialUser, setInitialUser] = useState({
    name: "",
    role: "Software Developer",
    email: "",
    bio: "Bio",
    profileImage: "",
    avatarUrl: "", 
    birthday: "",
    gender: "",
    profession: "",
    goals: ["Texto"],
    skills: [
      { label: "Software", value: 80 },
      { label: "Mobile App", value: 70 },
      { label: "Full Stack", value: 90 },
    ],
  });

  const [form, setForm] = useState({ name: "", bio: "" });
  const [goals, setGoals] = useState(["Texto"]);
  const [goalInput, setGoalInput] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const base = user
          ? {
              name: user.firstName
                ? `${user.firstName} ${user.lastName ?? ""}`.trim()
                : user.name || "",
              role: user.role || "Software Developer",
              email: user.email || "",
              bio: user.bio || "Bio",
              profileImage: user.profileImage || user.avatarUrl || "",
              avatarUrl: user.avatarUrl || user.profileImage || "",
              birthday: user.birthday || "",
              gender: user.gender || "",
              profession: user.profession || "",
              goals: user.goals || ["Texto"],
              skills:
                user.skills || [
                  { label: "Software", value: 80 },
                  { label: "Mobile App", value: 70 },
                  { label: "Full Stack", value: 90 },
                ],
            }
          : await profileApi.me(); 

        if (!mounted) return;

        const norm = normalizeUser(base);
        setInitialUser(norm);
        setForm({ name: norm.name || "", bio: norm.bio || "" });
        setGoals(Array.isArray(norm.goals) ? norm.goals : ["Texto"]);
      } catch {
        setError("No se pudo cargar el perfil");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  const fetchProfile = async () => {
    try {
      const data = await profileApi.me();
      const norm = normalizeUser(data); 
      setInitialUser(norm);
      setForm({ name: norm.name || "", bio: norm.bio || "" });
      setGoals(Array.isArray(norm.goals) ? norm.goals : ["Texto"]);
    } catch (e) {
      console.error("Failed to fetch profile:", e);
      setError("No se pudo actualizar el perfil");
    }
  };

  const onChange = (k) => (e) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
    setError("");
  };

  const onCancel = () => {
    setForm({ name: initialUser.name, bio: initialUser.bio || "" });
    setDirty(false);
    setError("");
  };

  const validate = useCallback(() => {
    if (!form.name.trim()) return "El nombre es obligatorio";
    if (form.bio.length > LIMITS.MAX_BIO)
      return `Máximo ${LIMITS.MAX_BIO} caracteres en la biografía`;
    return "";
  }, [form]);

  const onSubmit = async (e) => {
    e?.preventDefault?.();
    const v = validate();
    if (v) return setError(v);

    setSaving(true);
    try {
      await profileApi.update({
        name: form.name,
        bio: form.bio,
        goals,
      });
      setDirty(false);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "No se pudo guardar el perfil"
      );
    } finally {
      setSaving(false);
    }
  };

  const addGoal = () => {
    const val = goalInput.trim();
    if (!val) return;
    if (goals.includes(val)) return;
    setGoals((g) => [...g, val]);
    setGoalInput("");
    setDirty(true);
  };

  const removeGoal = (val) => {
    setGoals((g) => g.filter((x) => x !== val));
    setDirty(true);
  };

  const onGoalKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addGoal();
    }
  };

  const sectionTitleProps = useMemo(() => ({}), []);

  return {
    state: {
      initialUser,
      form,
      dirty,
      saving,
      error,
      goals,
      goalInput,
    },
    actions: {
      setGoalInput,
      onChange,
      onCancel,
      onSubmit,
      addGoal,
      removeGoal,
      onGoalKey,
      fetchProfile,
    },
    ui: {
      sectionTitleProps,
    },
  };
}
