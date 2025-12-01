import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";

export function TopicEditDialog({ open, onClose, topic, onSubmit }) {
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (topic) {
      setTitle(topic.title || "");
      setOrder(topic.order || 0);
      setDescription(topic.description || "");
    }
  }, [topic]);

  const handleSave = () => {
    onSubmit({
      title,
      order: Number(order),
      description,
    });
  };

  if (!topic) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={800}>Editar tópico</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

          <TextField
            label="Título"
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
        <Button variant="contained" onClick={handleSave}>
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}
