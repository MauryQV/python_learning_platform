// frontend/src/features/teacher_admin/api/teacherAdminApi.js
import { api } from "@/api/axiosInstance";

/**
 * Normaliza el curso del backend a la tarjeta de UI.
 * backend → { id, name, description, startDate, endDate, status, code, teacher:{id,name,email}, numeroEstudiantes }
 * UI     → { id, title, description, teacher, students, duration, status, emoji, gradient, code }
 */
function mapCourse(c) {
  const title = c?.name ?? "(Sin nombre)";
  const teacherName = c?.teacher?.name ?? "Sin docente asignado";
  const students = typeof c?.numeroEstudiantes === "number" ? c.numeroEstudiantes : 0;

  // duración calculada en horas si hay fechas
  let duration = "";
  try {
    if (c?.startDate && c?.endDate) {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      const ms = Math.max(0, end - start);
      const hours = Math.round(ms / (1000 * 60 * 60));
      duration = hours > 0 ? `${hours}h` : "";
    }
  } catch {}

  return {
    id: c?.id ?? c?.courseId ?? crypto.randomUUID(),
    title,
    description: c?.description ?? "",
    teacher: teacherName,
    students,
    duration,
    status: (c?.status ?? "active").toLowerCase(),
    code: c?.code ?? "",             // ← incluye code en la UI
    emoji: "📘",
    gradient: "linear-gradient(90deg,#a5d8ff,#c3f0ff)",
    _raw: c,
  };
}

async function safeGet(url) {
  try {
    const res = await api.get(url);
    return { ok: true, data: res.data };
  } catch (err) {
    console.error(`teacherAdminApi GET ${url} error:`, err?.response ?? err);
    return { ok: false, error: err?.response ?? err };
  }
}

export const teacherAdminApi = {
  // ===== LISTADOS =====
  async listCourses() {
    const r = await safeGet("/course/courses");
    if (!r.ok) {
      return {
        items: [],
        error: r.error?.data?.message || r.error?.statusText || "Error 500 en backend",
      };
    }
    const payload = r.data;
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.courses)
        ? payload.courses
        : [];
    return { items: list.map(mapCourse), error: null };
  },

  async listTeachers() {
    const r = await safeGet("/admin/users");
    if (!r.ok) {
      return { items: [], error: r.error?.data?.message || "No se pudo listar usuarios" };
    }
    const raw = Array.isArray(r.data) ? r.data
      : Array.isArray(r.data?.users) ? r.data.users
      : [];

    const teachers = raw.filter(u => {
      const roles = Array.isArray(u?.roles)
        ? u.roles
            .map(x => (typeof x === "string" ? x : (x?.name || x?.role?.name || "")))
            .map(s => String(s).toLowerCase())
        : (typeof u?.role === "string" ? [u.role.toLowerCase()] : []);
      return roles.includes("teacher") || roles.includes("instructor");
    });

    const mapped = teachers.map(u => ({
      id: u?.id ?? u?.userId ?? u?._id,
      name: [u?.firstName, u?.lastName].filter(Boolean).join(" ").trim() || (u?.email || "Docente"),
      email: u?.email || "",
    }));

    return { items: mapped, error: null };
  },

  // ===== ACCIONES =====
  /**
   * Crea curso en backend.
   * Backend requiere: { name, description, startDate, endDate, code }
   * Opcionalmente luego asignamos docente por endpoint aparte.
   */
  async createCourse({ name, description, status, durationHours, code }) {
    // fallbacks por si faltan datos desde el diálogo
    const safeName = String(name ?? "").trim() || "(Sin nombre)";
    const safeCode = (code && String(code).trim()) || `LP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const start = new Date();
    const end = new Date(start.getTime() + Math.max(1, Number(durationHours) || 1) * 60 * 60 * 1000);

    const body = {
      name: safeName,
      description: description ?? "",
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      code: safeCode,
      // NOTA: teacherId no se usa en create; se asigna en otro endpoint
    };

    const res = await api.post("/course/create-course", body);
    const created = res?.data?.course ?? res?.data; // el controller responde { message, course }
    return mapCourse(created);
  },

  /**
   * Asigna docente a curso.
   */
  async assignTeacherToCourse(courseId, teacherId) {
    const res = await api.post(`/course/${courseId}/teacher/${teacherId}`);
    const updated = res?.data?.course ?? res?.data;
    return mapCourse(updated);
  },
};

export default teacherAdminApi;

