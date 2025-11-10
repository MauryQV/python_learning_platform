// src/features/courses/components/CourseCreateDialog.jsx
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function CourseCreateDialog({
  open,
  onClose,
  onCreate,
  teachers = [],
}) {
  const initial = useMemo(
    () => ({
      nombre: "",
      descripcion: "",
      docenteId: "",
      estado: "active",
      duracionHoras: "40",
      cupoMaximo: "30",
    }),
    []
  );

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState({});

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const errors = {
    nombre: touched.nombre && form.nombre.trim() === "" ? "Requerido" : "",
    docenteId:
      touched.docenteId && String(form.docenteId).trim() === ""
        ? "Seleccione un docente"
        : "",
    estado:
      touched.estado && !["active", "draft"].includes(form.estado)
        ? "Inválido"
        : "",
    duracionHoras:
      touched.duracionHoras &&
      (Number.isNaN(Number(form.duracionHoras)) ||
        Number(form.duracionHoras) <= 0)
        ? "Debe ser un número > 0"
        : "",
    cupoMaximo:
      touched.cupoMaximo &&
      (Number.isNaN(Number(form.cupoMaximo)) || Number(form.cupoMaximo) < 0)
        ? "Debe ser un número ≥ 0"
        : "",
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const handleSubmit = async () => {
    setTouched({
      nombre: true,
      docenteId: true,
      estado: true,
      duracionHoras: true,
      cupoMaximo: true,
    });
    if (hasErrors) return;

    try {
      setSaving(true);
      const payload = {
        name: form.nombre.trim(),
        description: form.descripcion.trim(),
        teacherId: form.docenteId,
        status: form.estado,
        durationHours: Number(form.duracionHoras),
        capacity: Number(form.cupoMaximo),
      };
      await onCreate?.(payload);
      setForm(initial);
      setTouched({});
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setForm(initial);
    setTouched({});
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: { sx: { backgroundColor: "rgba(15,27,42,.55)" } },
        paper: {
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          pr: 6,
          py: 2,
        }}
      >
        Crear Nuevo Curso
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 12, top: 10 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          borderColor: "#eef0f3",
          // Ritmo y consistencia visual como en el mock:
          pt: 2.5,
          pb: 1.5,
        }}
      >
        {/* Normaliza los number inputs para que no “crezcan” por los spinners */}
        <Box
          sx={{
            "& input[type=number]": { MozAppearance: "textfield" },
            "& input[type=number]::-webkit-outer-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
            "& input[type=number]::-webkit-inner-spin-button": {
              WebkitAppearance: "none",
              margin: 0,
            },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                size="small"
                label="Nombre del Curso"
                placeholder="Ej: Introducción a JavaScript"
                value={form.nombre}
                onChange={(e) => setField("nombre", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
                fullWidth
                error={Boolean(errors.nombre)}
                helperText={errors.nombre || " "}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                label="Descripción"
                placeholder="Describe el contenido y objetivos del curso..."
                value={form.descripcion}
                onChange={(e) => setField("descripcion", e.target.value)}
                multiline
                minRows={3}
                fullWidth
                helperText=" "
              />
            </Grid>

            {/* Fila 2: Docente / Estado */}
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                select
                label="Docente *"
                value={form.docenteId}
                onChange={(e) => setField("docenteId", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, docenteId: true }))}
                fullWidth
                error={Boolean(errors.docenteId)}
                helperText={errors.docenteId || " "}
              >
                {teachers.length === 0 ? (
                  <MenuItem value="" disabled>
                    No hay docentes
                  </MenuItem>
                ) : (
                  teachers.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                select
                label="Estado *"
                value={form.estado}
                onChange={(e) => setField("estado", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, estado: true }))}
                fullWidth
                error={Boolean(errors.estado)}
                helperText={errors.estado || " "}
              >
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="draft">Borrador</MenuItem>
              </TextField>
            </Grid>

            {/* Fila 3: Duración / Cupo */}
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                label="Duración (horas)"
                type="number"
                value={form.duracionHoras}
                onChange={(e) => setField("duracionHoras", e.target.value)}
                onBlur={() =>
                  setTouched((t) => ({ ...t, duracionHoras: true }))
                }
                fullWidth
                error={Boolean(errors.duracionHoras)}
                helperText={errors.duracionHoras || " "}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                label="Cupo Máximo"
                type="number"
                value={form.cupoMaximo}
                onChange={(e) => setField("cupoMaximo", e.target.value)}
                onBlur={() =>
                  setTouched((t) => ({ ...t, cupoMaximo: true }))
                }
                fullWidth
                error={Boolean(errors.cupoMaximo)}
                helperText={errors.cupoMaximo || " "}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Los campos marcados con * son obligatorios.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.25,
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Button onClick={handleClose}>Cancelar</Button>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
            sx={{
              bgcolor: "#22c55e",
              ":hover": { bgcolor: "#16a34a" },
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            {saving ? "Guardando..." : "✓ Guardar Curso"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
