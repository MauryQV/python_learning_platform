import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import SectionTitle from "./SectionTitle";
import { LIMITS } from "@/shared/config/limits";

export default function ProfileForm({ form, error, dirty, saving, onChange, onCancel, onSubmit }) {
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <SectionTitle>Mi Perfil</SectionTitle>
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Nombre completo"
            fullWidth
            value={form.name}
            onChange={onChange("name")}
            autoComplete="name"
          />
          <TextField
            label="Biografía"
            fullWidth
            value={form.bio}
            onChange={(e) => {
              if (e.target.value.length <= LIMITS.MAX_BIO) onChange("bio")(e);
            }}
            multiline
            minRows={4}
            helperText={`${form.bio.length}/${LIMITS.MAX_BIO}`}
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={onCancel} disabled={saving || !dirty}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={saving || !dirty}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}