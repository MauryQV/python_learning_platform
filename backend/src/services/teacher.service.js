import { getAllTeachers } from "../repositories/teacher.repository.js";

export const getAllTeachersService = async() =>{
    const teachers = await getAllTeachers();
    return {
        teachers
    }
}