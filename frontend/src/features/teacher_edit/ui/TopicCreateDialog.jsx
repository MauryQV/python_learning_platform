import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";

export function TopicCreateDialog({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(0);
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    onSubmit({
      title,
      order: Number(order),
      description,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={800}>Crear nuevo tópico</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

          <TextField
            label="Título del tópico"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Orden"
            type="number"
            fullWidth
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />

          <TextField
            label="Descripción"
            multiline
            minRows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleCreate}>
          Crear tópico
        </Button>
      </DialogActions>
    </Dialog>
  );
}
