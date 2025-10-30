import { useCallback, useEffect, useMemo, useState } from "react";
import { LIMITS } from "@/shared/config/limits";
import { profileApi } from "@/features/profile/api/profileApi"; 
import { useAuth } from "@/context/AuthContext";

export function useProfileModel() {
  const { user } = useAuth();
  const [initialUser, setInitialUser] = useState({
    name: "",
    role: "Software Developer",
    email: "",
    bio: "Bio",
    avatarUrl: "",
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
              avatarUrl: user.avatarUrl || "",
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

        setInitialUser(base);
        setForm({ name: base.name || "", bio: base.bio || "" });
        setGoals(Array.isArray(base.goals) ? base.goals : ["Texto"]);
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
      setInitialUser(data);
      setForm({ name: data.name || "", bio: data.bio || "" });
      setGoals(Array.isArray(data.goals) ? data.goals : ["Texto"]);
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
