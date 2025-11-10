import { ToggleButtonGroup, ToggleButton, Stack } from "@mui/material";

export default function CourseFilters({ value, onChange }) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      <ToggleButtonGroup
        color="standard"
        exclusive
        value={value}
        onChange={(_, next) => next && onChange(next)}
        sx={{
          "& .MuiToggleButton-root": {
            borderRadius: 999,
            textTransform: "none",
            px: 2,
            py: 0.8,
            borderColor: "#d9dee6",
            bgcolor: "#fff",
          },
          "& .Mui-selected": {
            bgcolor: "#f6d458 !important",
            borderColor: "#f6d458",
            fontWeight: 700,
            color: "#000",
          },
        }}
      >
        <ToggleButton value="all">Todos</ToggleButton>
        <ToggleButton value="active">Activos</ToggleButton>
        <ToggleButton value="draft">Borradores</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
