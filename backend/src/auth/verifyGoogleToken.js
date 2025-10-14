import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verifica un idToken de Google y devuelve los datos del usuario.
 * @param {string} idToken - Token de Google enviado desde el frontend
 * @returns {Promise<{ email: string, googleId: string, name: string, picture: string }>}
 */
export async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  return {
    email: payload.email,
    googleId: payload.sub, // ID único de Google
    name: payload.name,
    picture: payload.picture,
  };
}
