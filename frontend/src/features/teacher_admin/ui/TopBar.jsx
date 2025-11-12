import { Box, Button, Typography } from "@mui/material";

export default function TopBar({ title, actions, rightUser }) {
  return (
    <Box
      sx={{
        px: 3, py: 2.5,
        bgcolor: "#fff",
        borderBottom: "1px solid #e6e8eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: 22, md: 28 } }}>
        {title}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {/* Acciones a la derecha (botones que varie cada página) */}
        {actions}

        {/* Usuario (opcional) */}
        {rightUser ? (
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1.2 }}>
            <Box
              sx={{
                width: 40, height: 40, borderRadius: "50%",
                bgcolor: "#e5e7eb", display: "grid", placeItems: "center", fontWeight: 800,
              }}
            >
              {rightUser.initials}
            </Box>
            <Box sx={{ lineHeight: 1 }}>
              <Typography variant="body2" fontWeight={700}>{rightUser.displayName}</Typography>
              <Typography variant="caption" color="text.secondary">{rightUser.roleLabel}</Typography>
            </Box>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
