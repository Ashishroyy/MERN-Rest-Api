import User from '../models/User.js';
import CustomErrorHandler from '../services/CustomErrorHandler.js';
const admin = (req ,res ,next) =>{
    try{
        const user = User.findOne({_id: req.User._id})
        if(user.role === 'admin'){
            next();
        }else{
            return next(CustomErrorHandler.unAthorized());
        }
     } catch(err){

        return next(CustomErrorHandler.serverError())
    }
}

export default admin;