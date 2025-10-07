import { Box, Container, Typography, Button } from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { supabase } from "../lib/supabaseClient";


export default function VerifyEmail() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <MarkEmailReadIcon sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" gutterBottom>Revisa tu email</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Te enviamos un link para verificar tu cuenta. Si no lo ves, revisa spam.
        </Typography>
        <Button variant="outlined">Resend email</Button>
      </Box>
    </Container>
  );
}
