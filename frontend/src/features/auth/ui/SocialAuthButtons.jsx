// src/features/auth/ui/SocialAuthButtons.jsx
import { IconButton, Tooltip } from "@mui/material";
import GoogleLogo from "./icons/GoogleLogo";
import MicrosoftLogo from "./icons/MicrosoftLogo";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

export default function SocialAuthButtons({ onGoogle, onMicrosoft }) {
  // id_token
  const handleGoogleLogin = useGoogleLogin({
    flow: "implicit", // usamos flujo para frontend
    onSuccess: async (tokenResponse) => {
      // Google devuelve un objeto con el access_token e id_token
      if (tokenResponse?.credential || tokenResponse?.access_token) {
        // Nota: el SDK a veces devuelve credential (id_token) o access_token
        const idToken = tokenResponse.credential || tokenResponse.access_token;
        if (onGoogle) onGoogle(idToken);
      } else {
        console.error("No se recibió un token válido de Google");
      }
    },
    onError: (err) => {
      console.error("Error al iniciar sesión con Google", err);
    },
  });

  return (
    <>
      {/* Botón de Google */}
      <Tooltip title="Continuar con Google">
        <IconButton
          aria-label="Continuar con Google"
          onClick={handleGoogleLogin}
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            "&:hover": { backgroundColor: "grey.50" },
          }}
        >
          <GoogleLogo />
        </IconButton>
      </Tooltip>

      {/* Botón de Microsoft */}
      <Tooltip title="Continuar con Microsoft">
        <IconButton
          aria-label="Continuar con Microsoft"
          onClick={onMicrosoft}
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            "&:hover": { backgroundColor: "grey.50" },
          }}
        >
          <MicrosoftLogo />
        </IconButton>
      </Tooltip>
    </>
  );
}
