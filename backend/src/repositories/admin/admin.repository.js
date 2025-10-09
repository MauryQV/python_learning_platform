import prisma from "../../../config/prismaClient.js"
class AdminRepository {

    async findByEmail(email){
        return prisma.user.findUnique({
            where: {email}
        })
    }

 


}