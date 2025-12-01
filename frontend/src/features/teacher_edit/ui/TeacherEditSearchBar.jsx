// frontend/src/features/teacher_edit/ui/TeacherEditSearchBar.jsx
import SearchIcon from "@mui/icons-material/Search";
import { TextField, InputAdornment } from "@mui/material";

export function TeacherEditSearchBar({ value, onChange }) {
  return (
    <TextField
      fullWidth
      size="medium"
      placeholder="Buscar cursos por nombre o código..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
      sx={{
        my: 2,
      }}
    />
  );
}
