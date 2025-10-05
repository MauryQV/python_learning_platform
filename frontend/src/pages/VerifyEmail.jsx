import { Box, Container, Typography, Button } from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

export default function VerifyEmail() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <MarkEmailReadIcon sx={{ fontSize: 64, mb: 2 }} />
        <Typography variant="h4" gutterBottom>Check your email</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          We sent you a verification link. If you don’t see it, check spam.
        </Typography>
        <Button variant="outlined">Resend email</Button>
      </Box>
    </Container>
  );
}
