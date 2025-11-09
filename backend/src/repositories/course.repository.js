import prisma from "../../config/prismaClient.js"

export const createCourse = async(name,description,startDate,endDate,code) => {
  return await prisma.course.create({
    data: {
      name,
      description,
      startDate,
      endDate,
      code
    }
  })
}



export const getAllCourses = async () => {
    const courses = await prisma.course.findMany({
      include: {
        teacher: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: { enrollments: true }, 
        },
      },
      orderBy: { courseId: "asc" },
    });

    // Mapeo limpio para la respuesta
    return courses.map((course) => ({
      id: course.courseId,
      name: course.name,
      description: course.description,
      startDate: course.startDate,
      endDate: course.endDate,
      status: course.status,
      code: course.code,
      teacher: course.teacher
        ? {
            id: course.teacher.userId,
            name: `${course.teacher.firstName} ${course.teacher.lastName}`,
            email: course.teacher.email,
          }
        : { name: "Sin docente asignado" },
      numeroEstudiantes: course._count.enrollments,
    }));
  }
  

export const assignTeacherToCourse = async (courseId, teacherId) => {
  return await prisma.course.update({
    where: { courseId },
    data: { teacherId },
    include: {
      teacher: {
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
          profileImage: true,
        },
      },
    },
  });
};

/**
 * Verifica si un curso existe
 */
export const findCourseById = async (courseId) => {
  return await prisma.course.findUnique({
    where: { courseId },
    select: {
      courseId: true,
      name: true,
      teacherId: true,
      status: true,
    },
  });
};

/**
 * Obtiene cursos asignados a un docente
 */
export const getCoursesByTeacher = async (teacherId) => {
  return await prisma.course.findMany({
    where: { 
      teacherId,
      status: 'active' 
    },
    include: {
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: { startDate: 'desc' },
  });
};

/**
 * Remueve docente de un curso
 */
export const removeTeacherFromCourse = async (courseId) => {
  return await prisma.course.update({
    where: { courseId },
    data: { teacherId: null },
  });
};


