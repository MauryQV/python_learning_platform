import jwt from "jsonwebtoken"


export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false,
      message: 'Token no proporcionado' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // add user info to request object
    req.userId = decoded.id || decoded.userId;
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'expired Token' 
      });
    }
    
    return res.status(401).json({ 
      success: false,
      message: 'Token inválido' 
    });
  }
};