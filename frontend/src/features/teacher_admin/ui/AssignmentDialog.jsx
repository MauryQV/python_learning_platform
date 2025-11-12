// frontend/src/features/teacher_admin/ui/AssignmentDialog.jsx
import { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Typography
} from "@mui/material";

export default function AssignmentDialog({
  open,
  onClose,
  course,        // { id, title, ... }
  teachers = [], // [{id,name,email}]
  onAssign,      // async (courseId, teacherId) => void
}) {
  const [teacherId, setTeacherId] = useState("");

  useEffect(() => {
    if (open) setTeacherId("");
  }, [open]);

  const handleAssign = async () => {
    if (!course?.id || !teacherId) return;
    await onAssign?.(course.id, teacherId);
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Asignar docente</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">Curso:</Typography>
          <Typography fontWeight={700}>{course?.title || "—"}</Typography>
        </Box>

        <TextField
          select
          fullWidth
          size="small"
          label="Docente"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          // 👇 hace que la etiqueta no se superponga
          InputLabelProps={{ shrink: true }}
          // 👇 muestra placeholder bonito cuando value === ""
          SelectProps={{
            displayEmpty: true,
            renderValue: (value) =>
              value === "" ? (
                <span style={{ opacity: 0.6 }}>Seleccionar…</span>
              ) : (
                (teachers.find(t => String(t.id) === String(value))?.name) || ""
              ),
          }}
          helperText="Elige un docente para este curso."
          sx={{
            "& .MuiSelect-select": { py: "9px !important" }, // altura consistente
          }}
        >
          {/* item de placeholder deshabilitado */}
          <MenuItem value="" disabled>
            <em>Seleccionar…</em>
          </MenuItem>

          {teachers.map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {t.name} {t.email ? `— ${t.email}` : ""}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleAssign} disabled={!teacherId}>
          Asignar Docente
        </Button>
      </DialogActions>
    </Dialog>
  );
}
