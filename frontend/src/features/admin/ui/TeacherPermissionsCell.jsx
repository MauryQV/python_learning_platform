// src/features/admin/ui/TeacherPermissionsCell.jsx
import { useMemo } from "react";
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
import { useTeacherPermissions } from "@/features/admin/model/useTeacherPermissions";

const pretty = (p) =>
  p === "teacher_editor" ? "Editor" :
  p === "teacher_executor" ? "Ejecutor" :
  p.replace(/^teacher_/, "").replace(/_/g, " ").replace(/\b\w/g, m => m.toUpperCase());

/**
 * Props:
 * - teacherId: number | string
 * - available: string[]  (ej. ["teacher_editor","teacher_executor"])
 * - disabled?: boolean
 */
export default function TeacherPermissionsCell({ teacherId, available = [], disabled }) {
  const { currentQuery, setPermissions } = useTeacherPermissions(teacherId);
  const loading = currentQuery.isLoading || currentQuery.isFetching;
  const value = currentQuery.data ?? [];

  const menu = useMemo(
    () => (available.length ? available : ["teacher_editor", "teacher_executor"]),
    [available]
  );

  return (
    <FormControl fullWidth size="small" disabled={disabled || loading}>
      <InputLabel id={`perm-${teacherId}`}>Permisos</InputLabel>
      <Select
        multiple
        labelId={`perm-${teacherId}`}
        value={value}
        onChange={(e) => setPermissions(e.target.value)}
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

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 0.5 }}>
          <Tooltip title="Cargando permisos…">
            <CircularProgress size={18} />
          </Tooltip>
        </Box>
      )}
    </FormControl>
  );
}
