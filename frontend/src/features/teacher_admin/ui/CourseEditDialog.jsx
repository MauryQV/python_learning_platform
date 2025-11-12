// Path: src/pages/teacher_admin/ui/CourseEditDialog.jsx
import { useEffect, useMemo, useState } from "react";
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

export default function CourseEditDialog({
  open,
  onClose,
  course,
  teachers = [],
  onSave,
  onDelete, // 👈 optional: provide from page to handle deletion
}) {
  const normalizeIncoming = (c) => {
    if (!c) return null;
    const hours =
      typeof c.durationHours === "number"
        ? c.durationHours
        : (typeof c.duration === "string" && c.duration.endsWith("h")
            ? Number(c.duration.replace("h", ""))
            : Number(c.duration || 40));

    return {
      nombre: c.title || "",
      descripcion: c.description || "",
      docenteId: c.teacherId ?? "",
      estado: c.status || "active",
      duracionHoras: String(Number.isFinite(hours) && hours > 0 ? hours : 40),
      cupoMaximo: String(Number.isFinite(c.capacity) ? c.capacity : 30),
      _emoji: c.emoji,
      _gradient: c.gradient,
      _teacherName: c.teacher,
      _id: c.id,
    };
  };

  const initial = useMemo(() => normalizeIncoming(course), [course]);
  const [form, setForm] = useState(
    initial || {
      nombre: "",
      descripcion: "",
      docenteId: "",
      estado: "active",
      duracionHoras: "40",
      cupoMaximo: "30",
      _id: undefined,
    }
  );
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open) {
      const next = normalizeIncoming(course);
      setForm(
        next || {
          nombre: "",
          descripcion: "",
          docenteId: "",
          estado: "active",
          duracionHoras: "40",
          cupoMaximo: "30",
          _id: undefined,
        }
      );
      setTouched({});
    }
  }, [open, course]);

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const errors = {
    nombre: touched.nombre && form.nombre.trim() === "" ? "Requerido" : "",
    docenteId:
      touched.docenteId && String(form.docenteId ?? "").trim() === ""
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
        id: form._id,
        name: form.nombre.trim(),
        description: form.descripcion.trim(),
        teacherId: form.docenteId,
        status: form.estado,
        durationHours: Number(form.duracionHoras),
        capacity: Number(form.cupoMaximo),
        emoji: form._emoji,
        gradient: form._gradient,
      };
      await onSave?.(payload);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  // 🗑️ Delete handler (asks for confirmation)
  const handleDelete = async () => {
    if (!onDelete || !form._id) return;
    const ok = window.confirm("¿Eliminar este curso? Esta acción no se puede deshacer.");
    if (!ok) return;
    await onDelete(form._id); // parent removes from state
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
        paper: { sx: { borderRadius: 3, overflow: "hidden" } },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, pr: 6, py: 2 }}>
        Editar Curso
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 12, top: 10 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: "#eef0f3", pt: 2.5, pb: 1.5 }}>
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
                label="Nombre del Curso *"
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
                value={form.descripcion}
                onChange={(e) => setField("descripcion", e.target.value)}
                multiline
                minRows={3}
                fullWidth
                helperText=" "
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                select
                label="Docente *"
                value={form.docenteId ?? ""}
                onChange={(e) => setField("docenteId", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, docenteId: true }))}
                fullWidth
                error={Boolean(errors.docenteId)}
                helperText={errors.docenteId || " "}
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (value) =>
                    value === "" ? (
                      <span style={{ opacity: 0.6 }}>Seleccionar docente</span>
                    ) : (
                      teachers.find((t) => t.id === value)?.name
                    ),
                }}
                sx={{ "& .MuiSelect-select": { paddingY: "9px !important" } }}
              >
                <MenuItem value="" disabled>
                  Seleccionar docente
                </MenuItem>
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
          {/* 🗑️ Red delete button to the LEFT of Guardar */}
          {onDelete && (
            <Button
              variant="contained"
              onClick={handleDelete}
              disabled={saving}
              sx={{
                bgcolor: "#ef4444",
                ":hover": { bgcolor: "#dc2626" },
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              ✕  Eliminar curso
            </Button>
          )}

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
            {saving ? "Guardando..." : "✓ Guardar"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
