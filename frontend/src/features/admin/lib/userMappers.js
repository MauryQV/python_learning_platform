// src/features/admin/lib/userMappers.js

// Convierte cualquier valor “parecido a booleano” en verdadero booleano
const toBool = (v) => {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (["1","true","yes","activo","active","enabled","enable"].includes(s)) return true;
    if (["0","false","no","inactivo","inactive","blocked","bloqueado","disabled","disable"].includes(s)) return false;
  }
  return undefined;
};

// Normaliza “estado” en un par { isActive, statusNormalized }
const normalizeStatus = (u) => {
  // 1) Prioriza flags booleanos típicos
  const candidates = [
    u?.isActive,
    u?.active,
    u?.enabled,
    typeof u?.blocked !== "undefined" ? !u.blocked : undefined,
  ];

  for (const c of candidates) {
    const b = toBool(c);
    if (typeof b === "boolean") {
      return { isActive: b, statusNormalized: b ? "active" : "blocked" };
    }
  }

  // 2) Luego campos de texto / variantes
  const raw =
    u?.status ??
    u?.accountStatus ??
    u?.state ??
    u?.userStatus ??
    u?.Status ??
    "";

  const s = String(raw || "").trim().toLowerCase();
  if (["active","activo","enabled","enable","true","1"].includes(s))
    return { isActive: true, statusNormalized: "active" };
  if (["blocked","bloqueado","disabled","disable","inactive","false","0"].includes(s))
    return { isActive: false, statusNormalized: "blocked" };

  // 3) Si no sabemos, usa false explícito para que la UI no titubee
  return { isActive: false, statusNormalized: s || "unknown" };
};

// Normaliza roles
const normalizeRoleName = (r) => {
  if (!r) return "";
  if (typeof r === "string") return r.trim().toLowerCase();
  return (
    r?.name || r?.role?.name || r?.Role?.name || r?.roleName || r?.rol || ""
  ).toString().trim().toLowerCase();
};

export const mapUser = (u) => {
  const { isActive, statusNormalized } = normalizeStatus(u);

  // roles como array o single
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
    isActive,            // 👈 la tabla confía en esto
    statusNormalized,    // info útil para debug
    _raw: u,             // por si necesitas revisar origen
  };
};

