import prisma  from "../../config/prismaClient.js";


export const createTopic = async(title, description,order,courseId) => {
    return await prisma.topic.create({
        data:{
            title,
            description,
            order,
            courseId
        }
    })
}
