import { getAllStudents } from "../repositories/student.repository.js";

export const getAllStudentsService = async() => {
    const students = await getAllStudents();
    return{
        message : "Students",
        students
    }
}