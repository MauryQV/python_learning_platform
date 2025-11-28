import prisma from "../../config/prismaClient.js";

export const createTopic = async (title, description, order, courseId) => {
  return await prisma.topic.create({
    data: {
      title,
      description,
      order,
      courseId,
    },
  });
};

export const updateTopic = async (
  topicId,
  title,
  description,
  order,
  courseId
) => {
  return await prisma.topic.update({
    where: { topicId },
    data: {
      title,
      description,
      order,
      courseId,
    },
  });
};

export const getAllTopics = async () => {
  const topics = await prisma.topic.findMany({
    include: {
      course: {
        select: {
          courseId: true,
          name: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return topics;
};
