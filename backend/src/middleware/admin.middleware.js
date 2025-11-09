import Joi from "joi";

const courseSchema = Joi.object({
    name: Joi.string().min(5).max(50).required().messages({
        "string.min": "The course name must be at least 5 characters long",
        "string.max": "The course name must be at most 50 characters long",
        "any.required": "The course name is required",
    }),
    description: Joi.string().min(3).max(25).required().messages({
        "string.min":"The course description must be at least 5 characters long",
        "string.max":"The course description must be at most 5 characters long",
        "any.required": "The course description is required"        
    }),
    startDate: Joi.date().required().messages({
        "any.required": "The start date is required"
    }),
    endDate: Joi.date().required().messages({
        "any.required": "The end date is required"
    }),
    code: Joi.string().required().messages({
        "any.required": "The code is required"
    }),

});


export const courseSchemaValidate = (req, res, next) => {
    if (!req.body) {
        req.body = {};
    }

    const {error} = courseSchema.validate(req.body, {abortEarly: false});
    
    if (error) {
        return res.status(400).json({
            success: false,
            message: "validation course error",
            details: error.details.map((err) => err.message),
        });
    }
    
    next(); 
}

