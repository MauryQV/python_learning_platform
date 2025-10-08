import { useState } from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { supabase } from "../lib/supabaseClient";

export default function VerifyEmail() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("pendingEmail");

  const resend = async () => {
    setMsg("");

    if (!email) {
      setMsg("Primero regístrate para asociar un correo.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      });

      if (error) {
        console.error("Supabase resend error:", error);
        setMsg(error.message);
      } else {
        setMsg("Correo de verificación enviado ✉️ Revisa tu bandeja de entrada o spam.");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setMsg("No se pudo reenviar el correo. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <MarkEmailReadIcon sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Revisa tu email
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Te enviamos un link para verificar tu cuenta. Si no lo ves, revisa la carpeta de spam.
        </Typography>

        <Button variant="outlined" onClick={resend} disabled={loading}>
          {loading ? "Enviando..." : "Reenviar correo"}
        </Button>

        {msg && (
          <Typography sx={{ mt: 2 }} color={msg.includes("error") ? "error" : "text.primary"}>
            {msg}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
