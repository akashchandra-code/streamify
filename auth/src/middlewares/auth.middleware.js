const userModel = require('../models/user.model');
const { verifyToken } = require('../utils/jwt');


const authMiddleware = async (req,res,next)=>{
    try {
        const token =  req.cookies?.token ||   
      req.header("Authorization")?.replace("Bearer ", "");
      console.log("Token from middleware:", token);
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        const decoded = verifyToken(token);
        console.log("Decoded token:", decoded);
        const user = await userModel.findById(decoded.id).select('-password');
        console.log("User from middleware:", user);
        if (!user) {
            return res.status(401).json({ message: 'Access denied. User not found.' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in auth middleware:", error);
        res.status(400).json({ message: 'Invalid token.' });
    }
}
module.exports = authMiddleware;