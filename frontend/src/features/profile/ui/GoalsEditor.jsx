import { Box, Chip, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

export default function GoalsEditor({ goals, goalInput, setGoalInput, addGoal, removeGoal, onGoalKey }) {
  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 2 }}>
        <TextField
          label="Añadir objetivo"
          fullWidth
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
          onKeyDown={onGoalKey}
        />
        <IconButton color="primary" aria-label="add goal" onClick={addGoal} sx={{ alignSelf: "center" }}>
          <AddIcon />
        </IconButton>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {goals.map((g) => (
          <Chip key={g} label={g} onDelete={() => removeGoal(g)} deleteIcon={<CloseIcon />} sx={{ mb: 1 }} />
        ))}
        {goals.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No hay objetivos. Agrega uno arriba.
          </Typography>
        )}
      </Stack>
    </>
  );
}
