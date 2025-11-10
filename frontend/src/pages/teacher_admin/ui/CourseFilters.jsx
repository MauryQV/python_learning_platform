import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ value, onChange }) {
  return (
    <TextField
      fullWidth
      size="medium"
      placeholder="Buscar cursos por nombre, docente o estado..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: "#6b7280" }} />
          </InputAdornment>
        ),
        sx: {
          borderRadius: 2,
          bgcolor: "#ffffff",
          "& input": {
            paddingY: 1.4, 
          },
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#d1d5db",
          },
          "&:hover fieldset": {
            borderColor: "#9ca3af",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#f6d458",
          },
        },
      }}
    />
  );
}
