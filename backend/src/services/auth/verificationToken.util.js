import crypto from "crypto";

export function generateRandomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function minutesFromNow(minutes = 60) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}
