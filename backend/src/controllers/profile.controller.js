import { findProfileById, updateProfile as updateProfileRepo,} from "../repositories/user.repository.js";

const toDateOrNull = (v) => (v ? new Date(`${v}T00:00:00.000Z`) : null);

const clip = (s, n) => (typeof s === "string" ? s.slice(0, n) : s);

function getAuthUserId(req) {
  const candidates = [req.user?.userId, req.userId, req.user?.id, req.user?.sub];
  for (const c of candidates) {
    const n = Number(c);
    if (!Number.isNaN(n) && Number.isInteger(n)) return n;
  }
  return null;
}

export async function getMe(req, res, next) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "No authenticated user id in token" });
    }

    const me = await findProfileById(userId);
    if (!me) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    return res.status(200).json(me);
  } catch (e) {
    next(e);
  }
}

export async function updateMe(req, res, next) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "No authenticated user id in token" });
    }

    const { name, birthday, gender, profession, bio } = req.body;

    let firstName;
    let lastName;
    if (name) {
      const parts = String(name).trim().split(/\s+/);
      firstName = parts.shift() || "";
      lastName = parts.join(" ");
    }

    const updated = await updateProfileRepo(userId, {
      firstName,
      lastName,
      birthday: typeof birthday === "string" ? toDateOrNull(birthday) : null,
      gender: gender ?? null,
      profession: profession ?? null,
      bio: bio ? clip(bio, 150) : null,
    });

    return res.status(200).json(updated);
  } catch (e) {
    next(e);
  }
}

export const getProfileController = getMe;
