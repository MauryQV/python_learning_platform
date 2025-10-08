import prisma from "../../config/prismaClient.js";

export const getProfileController = async (req, res) => {
  try {
    let tokenId = req.userId ?? req.user?.id ?? req.user?.sub;
    if (!tokenId) {
      return res.status(401).json({ success: false, message: "No user id in token" });
    }

    
    let whereClause;
    const parsed = Number(tokenId);
    if (!Number.isNaN(parsed) && Number.isInteger(parsed)) {
      whereClause = { id: parsed }; 
    } else {
      whereClause = { id: tokenId }; 
    }

    
    const user = await prisma.user.findUnique({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("getProfileController error:", error);
    return res.status(500).json({ success: false, message: "Error retrieving profile", error: error.message });
  }
};

