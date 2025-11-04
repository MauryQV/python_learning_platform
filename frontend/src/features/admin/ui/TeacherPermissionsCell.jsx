import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Tooltip,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useTeacherPermissions } from "@/features/admin/model/useTeacherPermissions";

const pretty = (p) =>
  p === "teacher_editor" ? "Editor" :
  p === "teacher_executor" ? "Ejecutor" :
  p
    .replace(/^teacher_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

/**
 * Props:
 * - teacherId: number | string
 * - available: string[]  (ej. ["teacher_editor","teacher_executor"])
 * - disabled?: boolean
 */
export default function TeacherPermissionsCell({ teacherId, available = [], disabled }) {
  const { enqueueSnackbar } = useSnackbar();
  const { currentQuery, setPermissions } = useTeacherPermissions(teacherId);
  const [saving, setSaving] = useState(false);

  const loading = currentQuery.isLoading || currentQuery.isFetching;
  const value = currentQuery.data ?? [];

  const menu = useMemo(
    () => (available.length ? available : ["teacher_editor", "teacher_executor"]),
    [available]
  );

  const onChange = async (e) => {
    const next = e.target.value;                   // array seleccionado tras el cambio
    const prevSet = new Set(value);
    const nextSet = new Set(next);

    // diff solo para mensajes
    const added = next.filter((p) => !prevSet.has(p));
    const removed = value.filter((p) => !nextSet.has(p));

    try {
      setSaving(true);
      // Tu hook se encarga de persistir (asignar/quitar) según el array "next"
      await setPermissions(next);

      // Mensajes de confirmación
      if (added.length) {
        enqueueSnackbar(
          `Permiso(s) asignado(s): ${added.map(pretty).join(", ")}`,
          { variant: "success" }
        );
      }
      if (removed.length) {
        enqueueSnackbar(
          `Permiso(s) quitado(s): ${removed.map(pretty).join(", ")}`,
          { variant: "info" }
        );
      }
      if (!added.length && !removed.length) {
        // No hubo cambios reales (p.ej., re-selección igual)
        enqueueSnackbar("Sin cambios de permisos.", { variant: "default" });
      }
    } catch (e2) {
      enqueueSnackbar(
        `No se pudo actualizar permisos: ${e2?.message ?? "Error"}`,
        { variant: "error" }
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormControl fullWidth size="small" disabled={disabled || loading || saving}>
      <InputLabel id={`perm-${teacherId}`}>Permisos</InputLabel>
      <Select
        multiple
        labelId={`perm-${teacherId}`}
        value={value}
        onChange={onChange}
        input={<OutlinedInput label="Permisos" />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {selected.map((p) => (
              <Chip key={p} size="small" label={pretty(p)} />
            ))}
          </Box>
        )}
      >
        {menu.map((p) => (
          <MenuItem key={p} value={p}>
            {pretty(p)}
          </MenuItem>
        ))}
      </Select>

      {(loading || saving) && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 0.5 }}>
          <Tooltip title={loading ? "Cargando permisos…" : "Guardando cambios…"}>
            <CircularProgress size={18} />
          </Tooltip>
        </Box>
      )}
    </FormControl>
  );
}

