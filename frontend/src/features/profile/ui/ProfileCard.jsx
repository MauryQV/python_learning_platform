import { Avatar, Box, Chip, Divider, Paper, Typography } from "@mui/material";
import { COLORS } from "@/shared/config/colors";

export default function ProfileCard({ name, role, email, bio, avatarUrl }) {
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3, position: { lg: "sticky" }, top: { lg: 24 }, height: "fit-content" }}>
      <Box sx={{ display: "grid", placeItems: "center", mb: 2 }}>
        <Box sx={{ width: 180, height: 180, borderRadius: "50%", border: `10px solid ${COLORS.YELLOW}`, overflow: "hidden" }}>
          <Avatar src={avatarUrl} alt={name} sx={{ width: "100%", height: "100%" }} />
        </Box>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "center" }}>
        {name || "Tu nombre"}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mb: 2 }}>
        {role}
      </Typography>

      <Box sx={{ display: "grid", placeItems: "center", my: 1 }}>
        <Chip label="“ ”" color="primary" variant="outlined" />
      </Box>

      <Typography variant="body2" sx={{ textAlign: "center", minHeight: 60, whiteSpace: "pre-wrap" }}>
        {bio || "Bio"}
      </Typography>

      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
        {email}
      </Typography>
    </Paper>
  );
}
