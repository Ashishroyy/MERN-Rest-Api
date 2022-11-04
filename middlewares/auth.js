import CustomErrorHandler from "../services/CustomerrorHandler.js";
import JwtServices from "../services/JwtServices.js";

const auth = async (req, res , next) =>{
    let authHeader = req.headers.authorization;

    if(!authHeader){
       return next(CustomErrorHandler.unAuthorized())
    }

    const token =  authHeader.split(' ')[1];
    try{
     const {_id, role} = await JwtServices.verify(token);
        const user = {
            _id,
            role
        }
        req.user = user;
        next();


    }catch(err){
       return next(CustomErrorHandler.unAuthorized())
    }
}

export default auth;