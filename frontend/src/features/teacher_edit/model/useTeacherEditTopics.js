import { useEffect, useState } from "react";
import { getTopics } from "@/features/teacher_edit/api/teacherEditApi";

export function useTeacherEditTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getTopics();
        setTopics(data.topics || []); 
        console.log("Tópicos obtenidos:", data.topics);
      } catch (error) {
        console.error("Error obteniendo tópicos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return { topics, loading };
}