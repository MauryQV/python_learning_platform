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
  } catch (e) {
    console.error("Error calculando duración:", e);
  }

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

    // Lista usuarios y filtra docentes por rol + agrega cursos asignados
  async listTeachers() {
    // 1) Users
    const rUsers = await safeGet("/admin/users");
    if (!rUsers.ok) {
      return { items: [], error: rUsers.error?.data?.message || "No se pudo listar usuarios" };
    }
    const rawUsers = Array.isArray(rUsers.data) ? rUsers.data
      : Array.isArray(rUsers.data?.users) ? rUsers.data.users
      : [];

    // 2) Courses
    const rCourses = await safeGet("/course/courses");
    const rawCourses = rCourses.ok
      ? (Array.isArray(rCourses.data) ? rCourses.data
         : Array.isArray(rCourses.data?.courses) ? rCourses.data.courses
         : [])
      : [];

    // 3) Normalizamos cursos mínimos para agrupar por docente
    //    - intentamos teacherId de varias formas
    //    - fallback por nombre del docente cuando no hay id
    const normCourses = rawCourses.map(c => {
      const id = c?.id ?? c?.courseId ?? c?._id;
      const name = c?.name ?? c?.title ?? "(Sin nombre)";
      const tObj = c?.teacher || c?.docente || c?.profesor || {};
      const teacherId = tObj?.id ?? c?.teacherId ?? c?._raw?.teacherId;
      const teacherName = tObj?.name ?? tObj?.fullName ?? c?.teacherName ?? "";
      return { id, name, teacherId, teacherName };
    });

    // 4) Filtramos solo docentes
    const teachersOnly = rawUsers.filter(u => {
      const roles = Array.isArray(u?.roles)
        ? u.roles
            .map(x => (typeof x === "string" ? x : (x?.name || x?.role?.name || "")))
            .map(s => String(s).toLowerCase())
        : (typeof u?.role === "string" ? [u.role.toLowerCase()] : []);
      return roles.includes("teacher") || roles.includes("instructor");
    });

    // 5) Index por id y por nombre para emparejar cursos → docente
    const byId = new Map();
    const byName = new Map();
    for (const u of teachersOnly) {
      const id = u?.id ?? u?.userId ?? u?._id;
      const name = [u?.firstName, u?.lastName].filter(Boolean).join(" ").trim() || (u?.email || "");
      byId.set(String(id), u);
      if (name) byName.set(name.toLowerCase(), u);
    }

    // 6) Construimos map idDocente → lista de cursos
    const coursesByTeacherId = new Map();
    function pushCourseFor(idKey, course) {
      if (!idKey) return;
      const k = String(idKey);
      if (!coursesByTeacherId.has(k)) coursesByTeacherId.set(k, []);
      coursesByTeacherId.get(k).push({ id: course.id, name: course.name });
    }

    for (const c of normCourses) {
      if (c.teacherId && byId.has(String(c.teacherId))) {
        pushCourseFor(c.teacherId, c);
      } else if (c.teacherName) {
        const found = byName.get(String(c.teacherName).toLowerCase());
        const foundId = found?.id ?? found?.userId ?? found?._id;
        if (foundId) pushCourseFor(foundId, c);
      }
    }

    // 7) Devolvemos docentes mapeados con cursos
    const mapped = teachersOnly.map(u => {
      const id = u?.id ?? u?.userId ?? u?._id;
      const name = [u?.firstName, u?.lastName].filter(Boolean).join(" ").trim() || (u?.email || "Docente");
      const email = u?.email || "";
      const courses = coursesByTeacherId.get(String(id)) || [];
      return { id, name, email, courses };
    });

    return { items: mapped, error: null };
  },

  /** Crea curso con EXACTAMENTE los campos que pide el backend */
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

  /** Asigna docente por ruta separada */
  async assignTeacherToCourse(courseId, teacherId) {
    const res = await api.post(`/course/${courseId}/teacher/${teacherId}`);
    return res.data;
  },
};

export default teacherAdminApi;
