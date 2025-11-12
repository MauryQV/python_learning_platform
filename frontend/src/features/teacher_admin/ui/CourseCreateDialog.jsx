// C:\GS\python_learning_platform\frontend\src\features\teacher_admin\ui\CourseCreateDialog.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, TextField, Button, Grid, Typography,
  Box, Stack, InputAdornment, Tooltip, MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/** Genera código tipo: LP-2025-AB7XQ */
function genCourseCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const token = Array.from({ length: 5 }, () =>
    alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join("");
  const year = new Date().getFullYear();
  return `LP-${year}-${token}`;
}

export default function CourseCreateDialog({
  open,
  onClose,
  onCreate,
  teachers = [], // para asignación posterior
}) {
  // Solo lo que pide el backend + teacherId opcional para asignar luego
  const initial = useMemo(
    () => ({
      nombre: "",
      descripcion: "",
      codigo: "",
      startDate: "", // datetime-local
      endDate: "",   // datetime-local
      docenteId: "", // opcional
    }),
    []
  );

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState({});
  const [codeManuallyChanged, setCodeManuallyChanged] = useState(false);

  useEffect(() => {
    if (open) {
      setForm((s) => ({
        ...s,
        codigo: s.codigo?.trim() ? s.codigo : genCourseCode(),
      }));
      setTouched({});
      setCodeManuallyChanged(false);
    }
  }, [open]);

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const errors = {
    nombre: touched.nombre && form.nombre.trim() === "" ? "Requerido" : "",
    descripcion: touched.descripcion && form.descripcion.trim() === "" ? "Requerido" : "",
    codigo: touched.codigo && !form.codigo?.trim() ? "Requerido" : "",
    startDate: touched.startDate && !form.startDate ? "Requerido" : "",
    endDate:
      touched.endDate && !form.endDate
        ? "Requerido"
        : (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)
          ? "Debe ser mayor que la fecha de inicio"
          : ""),
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleSubmit = async () => {
    setTouched({
      nombre: true,
      descripcion: true,
      codigo: true,
      startDate: true,
      endDate: true,
    });
    if (hasErrors) return;

    try {
      setSaving(true);
      const startISO = new Date(form.startDate).toISOString();
      const endISO = new Date(form.endDate).toISOString();

      await onCreate?.({
        name: form.nombre.trim(),
        description: form.descripcion.trim(),
        startDate: startISO,
        endDate: endISO,
        code: form.codigo.trim(),
        teacherId: form.docenteId || null, // se usa para asignación post-crear
      });

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

  const regenerateCode = () => {
    setForm((s) => ({ ...s, codigo: genCourseCode() }));
    setTouched((t) => ({ ...t, codigo: true }));
    setCodeManuallyChanged(true);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        backdrop: { sx: { backgroundColor: "rgba(15,27,42,.55)" } },
        paper: { sx: { borderRadius: 3, overflow: "hidden" } },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, pr: 6, py: 2 }}>
        Crear Nuevo Curso
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: "absolute", right: 12, top: 10 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: "#eef0f3", pt: 2.5, pb: 1.5 }}>
        <Box>
          <Grid container spacing={2}>
            {/* Nombre / Descripción */}
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                label="Nombre del Curso *"
                placeholder="Ej: Introducción a Python"
                value={form.nombre}
                onChange={(e) => setField("nombre", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
                fullWidth
                error={Boolean(errors.nombre)}
                helperText={errors.nombre || " "}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                label="Descripción *"
                placeholder="Describe objetivos y contenidos del curso..."
                value={form.descripcion}
                onChange={(e) => setField("descripcion", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, descripcion: true }))}
                fullWidth
                error={Boolean(errors.descripcion)}
                helperText={errors.descripcion || " "}
              />
            </Grid>

            {/* Código */}
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                label="Código de Curso *"
                value={form.codigo}
                onChange={(e) => {
                  setField("codigo", e.target.value.toUpperCase());
                  setCodeManuallyChanged(true);
                }}
                onBlur={() => setTouched((t) => ({ ...t, codigo: true }))}
                fullWidth
                error={Boolean(errors.codigo)}
                helperText={
                  errors.codigo ||
                  (codeManuallyChanged ? "Puedes ajustar el código si lo necesitas." : "Se genera automáticamente.")
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Regenerar código aleatorio">
                        <Button size="small" variant="outlined" onClick={regenerateCode} sx={{ textTransform: "none", fontWeight: 700 }}>
                          Regenerar
                        </Button>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Fechas */}
            <Grid item xs={12} md={3}>
              <TextField
                size="small"
                label="Inicio *"
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => setField("startDate", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, startDate: true }))}
                fullWidth
                error={Boolean(errors.startDate)}
                helperText={errors.startDate || " "}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                size="small"
                label="Fin *"
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => setField("endDate", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, endDate: true }))}
                fullWidth
                error={Boolean(errors.endDate)}
                helperText={errors.endDate || " "}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Docente opcional */}
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                select
                label="Docente (opcional)"
                value={form.docenteId}
                onChange={(e) => setField("docenteId", e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (value) =>
                    value === ""
                      ? <span style={{ opacity: 0.6 }}>Sin docente</span>
                      : (teachers.find((t) => String(t.id) === String(value))?.name ?? ""),
                }}
                helperText="Si seleccionas un docente, se asignará al crear el curso."
              >
                <MenuItem value="" disabled>
                  <em>Sin docente</em>
                </MenuItem>
                {teachers.map(t => (
                  <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Los campos marcados con * son obligatorios.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.25, display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
        <Button onClick={handleClose}>Cancelar</Button>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
            sx={{ bgcolor: "#22c55e", ":hover": { bgcolor: "#16a34a" }, fontWeight: 700, textTransform: "none" }}
          >
            {saving ? "Guardando..." : "Guardar Curso"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
