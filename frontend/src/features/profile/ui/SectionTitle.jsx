import { Box, Typography } from "@mui/material";
import { COLORS } from "@/shared/config/colors";

export default function SectionTitle({ children }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        px: 3,
        py: 1,
        bgcolor: COLORS.YELLOW,
        borderRadius: 1,
        mb: 2,
        alignItems: "center",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {children}
      </Typography>
    </Box>
  );
}
