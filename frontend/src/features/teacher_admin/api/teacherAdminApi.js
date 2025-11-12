// C:\GS\python_learning_platform\frontend\src\features\teacher_admin\api\teacherAdminApi.js
import { api } from "@/api/axiosInstance";

/** Normaliza un curso del backend a la tarjeta de UI */
function mapCourse(c) {
  const title = c?.name ?? "(Sin nombre)";
  const teacherName = c?.teacher?.name ?? "Sin docente asignado";
  const students = typeof c?.numeroEstudiantes === "number" ? c.numeroEstudiantes : 0;

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
    id: c?.id ?? c?.courseId ?? c?._id ?? crypto.randomUUID(),
    title,
    description: c?.description ?? "",
    teacher: teacherName,
    students,
    duration,
    status: (c?.status ?? "active").toLowerCase(),
    emoji: "📘",
    gradient: "linear-gradient(90deg,#a5d8ff,#c3f0ff)",
    code: c?.code ?? "",
    _raw: c,
  };
}

async function safeGet(url) {
  try {
    const res = await api.get(url);
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, error: err?.response ?? err };
  }
}

export const teacherAdminApi = {
  // Lista cursos (soporta {courses:[]} o [])
  async listCourses() {
    const r = await safeGet("/course/courses");
    if (!r.ok) {
      return {
        items: [],
        error: r.error?.data?.message || r.error?.statusText || "Error al listar cursos",
      };
    }
    const payload = r.data;
    const list = Array.isArray(payload) ? payload
      : Array.isArray(payload?.courses) ? payload.courses
      : [];
    return { items: list.map(mapCourse), error: null };
  },

  // Lista usuarios y filtra docentes por rol
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
        ? u.roles.map(x => (typeof x === "string" ? x : (x?.name || x?.role?.name || ""))).map(s => String(s).toLowerCase())
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

  /** ✅ Crea curso con EXACTAMENTE los campos que pide el backend */
  async createCourse({ name, description, startDate, endDate, code }) {
    try {
      const res = await api.post("/course/create-course", {
        name,
        description,  // NO vacío: valida antes de enviar
        startDate,    // ISO string
        endDate,      // ISO string
        code,         // único
      });
      // controller retorna { message, course }
      const course = res?.data?.course ?? res?.data;
      return mapCourse(course);
    } catch (err) {
      const payload = err?.response?.data;
      const msg =
        payload?.error ||
        payload?.message ||
        (Array.isArray(payload?.details) ? payload.details.join(", ") : "") ||
        err?.message ||
        "Bad Request";
      const e = new Error(msg);
      e.response = err?.response;
      throw e;
    }
  },

  /** ✅ Asigna docente por ruta separada */
  async assignTeacherToCourse(courseId, teacherId) {
    const res = await api.post(`/course/${courseId}/teacher/${teacherId}`);
    return res.data;
  },
};

export default teacherAdminApi;
