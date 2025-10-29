// src/features/admin/lib/userMappers.js

const toBool = (v) => {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (["1","true","yes","si","sí","on","enabled","enable","activo","active"].includes(s)) return true;
    if (["0","false","no","off","disabled","disable","inactivo","inactive","bloqueado","blocked"].includes(s)) return false;
  }
  return undefined;
};

const normalizeStatus = (u = {}) => {
  
  const rawStatus = u?.status ?? u?.estatus;

  if (typeof rawStatus === "string") {
    const s = rawStatus.trim().toLowerCase();
    if (s === "active")   return { isActive: true,  status: "active",  statusNormalized: "active" };
    if (s === "blocked")  return { isActive: false, status: "blocked", statusNormalized: "blocked" };
    return { isActive: undefined, status: s, statusNormalized: s || "unknown" };
  }

  // 1) Flags booleanos típicos (si existen)
  const candidates = [
    u?.isActive,
    u?.active,
    u?.enabled,
    typeof u?.blocked !== "undefined" ? !u.blocked : undefined,
  ];
  for (const c of candidates) {
    const b = toBool(c);
    if (typeof b === "boolean") {
      return { isActive: b, status: b ? "active" : "blocked", statusNormalized: b ? "active" : "blocked" };
    }
  }

  // 2) Otras variantes textuales secundarias (si no hay status/estatus)
  const raw =
    u?.accountStatus ??
    u?.state ??
    u?.userStatus ??
    u?.Status ??
    "";

  const s = String(raw || "").trim().toLowerCase();
  if (s === "active")  return { isActive: true,  status: "active",  statusNormalized: "active" };
  if (s === "blocked") return { isActive: false, status: "blocked", statusNormalized: "blocked" };

  return { isActive: undefined, status: "", statusNormalized: s || "unknown" };
};

/* roles */
const normalizeRoleName = (r) => {
  if (!r) return "";
  if (typeof r === "string") return r.trim().toLowerCase();
  return (
    r?.name || r?.role?.name || r?.Role?.name || r?.roleName || r?.rol || ""
  ).toString().trim().toLowerCase();
};

/* ---------------- mapper principal ---------------- */
export const mapUser = (u = {}) => {
  const { isActive, status, statusNormalized } = normalizeStatus(u);

  const rolesRaw =
    u?.roles ||
    u?.Roles ||
    u?.userRoles ||
    (u?.role ? [u.role] : []) ||
    [];

  const roles = Array.isArray(rolesRaw)
    ? rolesRaw.map(normalizeRoleName).filter(Boolean)
    : [];

  const primaryRole =
    normalizeRoleName(
      u?.primaryRole || u?.role || u?.Role || u?.mainRole || roles[0] || "user"
    ) || "user";

  return {
    id: u?.id ?? u?._id ?? u?.userId ?? u?.uid,
    email: u?.email ?? u?.username ?? u?.mail ?? "",
    firstName: u?.firstName ?? u?.given_name ?? "",
    lastName: u?.lastName ?? u?.family_name ?? "",

    roles,
    primaryRole,

    // La tabla usa este booleano
    isActive: typeof isActive === "boolean" ? isActive : status === "active",
    status,           
    statusNormalized, 

    _raw: u,
  };
};

export { toBool, normalizeStatus };

