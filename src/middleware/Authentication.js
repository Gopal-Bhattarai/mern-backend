import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import dotenv from 'dotenv'
dotenv.config()


//make sure token exists
const isAuthenticated = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token) {
        return res.status(401).json({Error: 'Access Denied on this resource, Token Invalid'})
    } 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.user.id).select("-password");
        next();
    } catch (error) {
        return res.status(401).json({Error: 'Access Denied on this resource, Internal Error'})
    }
}

//check if the user's role is admin
const isAdmin = (req, res, next) => {
    try {
        if(req.user.role!=='admin'){
            return res.status(401).json({Error: 'Not an Admin, Access Denied on this resource'})    
        }
        next();
    } catch (error) {
        return res.status(500).json({Error: 'Internal Server Error'})    
    }
}

export default isAuthenticated;
export {isAdmin};