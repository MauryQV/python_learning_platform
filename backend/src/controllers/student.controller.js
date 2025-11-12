import { getAllStudentsService } from "../services/student.service.js";

export const getAllStudentsController = async(req,res,next) => {
    try{
        const students = await getAllStudentsService();
        res.status(200).json(students);

    }
    catch(error){
    next(error);
    }

}