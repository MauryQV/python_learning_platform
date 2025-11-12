import{
    createTopicService,
}from "../../src/services/topic.service.js";

import{
    createTopic,
}from "../../src/repositories/topic.repository.js";
// Mocks
jest.mock("../../src/repositories/topic.repository.js");
describe("Topic Service",()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    }); 
    // -------------------------------------------------------------------
    // createTopicService
    // -------------------------------------------------------------------          
describe("createTopicService",()=>{         
    it("debería crear un tema correctamente",async()=>{
        const mockTopic={
            id:1,               
            title:"Introducción a Python",
            description:"Conceptos básicos de Python",
            order:1,
            courseId:1,             
        };  
        createTopic.mockResolvedValue(mockTopic);
        const result=await createTopicService(
            "Introducción a Python",    
            "Conceptos básicos de Python",
            1,             
            1   
        );      
        expect(createTopic).toHaveBeenCalledWith(
            "Introducción a Python",    
            "Conceptos básicos de Python",
            1,             
            1   
        );  
        expect(result).toEqual({
            message:"Topico",
            topic:mockTopic,
        });  
    }); 
    it("debería lanzar un error si createTopic falla",async()=>{
        createTopic.mockRejectedValue(new Error("Database error"));
        await expect(createTopicService(    
            "Introducción a Python",    
            "Conceptos básicos de Python",
            1,             
            1   
        )).rejects.toThrow("Database error");
    }
    );
});
}
);