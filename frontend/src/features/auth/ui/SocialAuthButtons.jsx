// src/features/auth/ui/SocialAuthButtons.jsx
import { IconButton, Tooltip } from "@mui/material";
import GoogleLogo from "./icons/GoogleLogo";
import MicrosoftLogo from "./icons/MicrosoftLogo";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

export default function SocialAuthButtons({ onGoogle, onMicrosoft }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      console.log("📩 Credential Response:", credentialResponse);

      // credentialResponse.credential contiene el id_token
      const idToken = credentialResponse.credential;

      if (!idToken) {
        throw new Error("No se recibió un id_token válido de Google");
      }

      const res = await fetch(
        "http://localhost:2999/api/auth/register/google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Error desde backend: ${err}`);
      }

      const data = await res.json();
      console.log("👤 Usuario registrado:", data);

      onGoogle?.(data);
    } catch (err) {
      console.error("❌ Error en login con Google:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("❌ Error en autenticación de Google");
  };

  const buttonStyles = {
    width: 56,
    height: 56,
    borderRadius: "50%",
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
    "&:hover": { backgroundColor: "grey.50" },
  };

  return (
    <>
      {/* Botón de Google - Versión con botón personalizado */}
      <Tooltip title="Continuar con Google">
        <div style={{ position: "relative" }}>
          <IconButton
            aria-label="Continuar con Google"
            sx={buttonStyles}
            disabled={isLoading}
          >
            <GoogleLogo />
          </IconButton>

          {/* GoogleLogin invisible encima del botón */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
            }}
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              size="large"
            />
          </div>
        </div>
      </Tooltip>

      {/* Botón de Microsoft */}
      <Tooltip title="Continuar con Microsoft">
        <IconButton
          aria-label="Continuar con Microsoft"
          onClick={onMicrosoft}
          sx={buttonStyles}
        >
          <MicrosoftLogo />
        </IconButton>
      </Tooltip>
    </>
  );
}
