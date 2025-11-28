import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

import { TeacherEditSidebarNav } from "@/features/teacher_edit/ui/TeacherEditSidebarNav";
import { TeacherEditTopBar } from "@/features/teacher_edit/ui/TeacherEditTopBar";
import { TeacherEditTopicsList } from "@/features/teacher_edit/ui/TeacherEditTopicsList";

import { useTeacherEditTopics } from "@/features/teacher_edit/model/useTeacherEditTopics";

import { TopicCreateDialog } from "@/features/teacher_edit/ui/TopicCreateDialog";
import { TopicEditDialog } from "@/features/teacher_edit/ui/TopicEditDialog";

import {
  createTopic,
  updateTopic,
} from "@/features/teacher_edit/api/teacherEditApi";

export default function TeacherEditTopicsPage({ openCreate, openEdit }) {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Hooks
  const { topics, loading } = useTeacherEditTopics();

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Abre automáticamente los diálogos dependiendo de la ruta
  useEffect(() => {
    if (openCreate) {
      setCreateOpen(true);
    }

    if (openEdit) {
      // El Topic seleccionado será asignado cuando el usuario haga click en editar desde la lista
      setEditOpen(true);
    }
  }, [openCreate, openEdit]);

  // Handlers for dialogs
  const handleOpenCreate = () => setCreateOpen(true);
  const handleCloseCreate = () => setCreateOpen(false);

  const handleOpenEdit = (topic) => {
    setSelectedTopic(topic);
    setEditOpen(true);
  };
  const handleCloseEdit = () => setEditOpen(false);

  // SUBMIT handlers
  const handleCreateTopic = async (data) => {
    try {
      await createTopic(courseId, data);
      handleCloseCreate();
      window.location.reload(); // recargar tópicos
    } catch (error) {
      console.error("Error creando tópico:", error);
    }
  };

  const handleEditTopic = async (data) => {
    try {
      await updateTopic(selectedTopic.topicId, data);
      handleCloseEdit();
      window.location.reload();
    } catch (error) {
      console.error("Error actualizando tópico:", error);
    }
  };

  // LOADING state
  if (loading) {
    return (
      <div className="page-layout">
        <TeacherEditSidebarNav />
        <main className="main-content">
          <TeacherEditTopBar />
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        </main>
      </div>
    );
  }

  return (
    <div className="page-layout" style={{ display: "flex" }}>
      <TeacherEditSidebarNav />

      <main className="main-content" style={{ flexGrow: 1 }}>
        <TeacherEditTopBar />

        <Box sx={{ p: 3 }}>
          {/* Botón crear tópico */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button variant="contained" onClick={handleOpenCreate}>
              Crear tópico
            </Button>
          </Box>

          {/* Listado de tópicos */}
          <TeacherEditTopicsList topics={topics} onEdit={handleOpenEdit} />
        </Box>
      </main>

      {/* DIÁLOGO: CREAR TÓPICO */}
      <TopicCreateDialog
        open={createOpen}
        onClose={handleCloseCreate}
        onSubmit={handleCreateTopic}
      />

      {/* DIÁLOGO: EDITAR TÓPICO */}
      <TopicEditDialog
        open={editOpen}
        topic={selectedTopic}
        onClose={handleCloseEdit}
        onSubmit={handleEditTopic}
      />
    </div>
  );
}
