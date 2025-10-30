import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button, Alert } from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import axios from "../api/axiosInstance";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = params.get("token");
    if (!token) return;

    setStatus("loading");
    (async () => {
      try {
        await axios.get(`/api/auth/verify-email`, { params: { token } });
        setStatus("ok");
        setTimeout(() => navigate("/login"), 2500);
      } catch (err) {
        setStatus("error");
        setReason(err?.response?.data?.reason || "unknown");
      }
    })();
  }, [params, navigate]);

  const resend = async () => {
    setMsg("");
    setLoading(true);
    try {
      const email = localStorage.getItem("pendingEmail");
      if (!email) {
        setMsg("No hay correo pendiente de verificación. Regístrate primero.");
        return;
      }

      await axios.post(`/api/auth/resend-verification`, { email });
      setMsg("Correo reenviado correctamente ✉️ Revisa tu bandeja o spam.");
    } catch (err) {
      console.error("Resend error:", err);
      setMsg("No se pudo reenviar el correo. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Render states
  if (status === "loading") {
    return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mt: 10 }}>
          <MarkEmailReadIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4">Verificando… ⏳</Typography>
          <Typography color="text.secondary">
            Estamos validando tu enlace de verificación.
          </Typography>
        </Box>
      </Container>
    );
  }

  if (status === "ok") {
    return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mt: 10 }}>
          <MarkEmailReadIcon sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4">✅ ¡Email verificado!</Typography>
          <Typography color="text.secondary">
            Redirigiendo al inicio de sesión…
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <MarkEmailReadIcon sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4">Revisa tu email</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Te enviamos un link de verificación. Si no lo ves, revisa tu carpeta de spam.
        </Typography>

        {status === "error" && (
          <Alert severity="error" sx={{ mb: 2 }}>
            ❌ No se pudo validar el token: <code>{reason}</code>
          </Alert>
        )}

        <Button variant="outlined" onClick={resend} disabled={loading}>
          {loading ? "Enviando..." : "Reenviar correo"}
        </Button>

        {msg && (
          <Typography sx={{ mt: 2 }} color={/No se pudo/i.test(msg) ? "error" : "text.primary"}>
            {msg}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
