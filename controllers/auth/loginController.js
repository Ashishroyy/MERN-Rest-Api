import Joi from "joi";
import User from "../../models/User.js";
import refreshToken from "../../models/refreshTokens.js";
import CustomErrorHandler from "../../services/CustomerrorHandler.js";
import bcrypt from 'bcrypt'
import JwtServices from "../../services/JwtServices.js";
import { REFRESH_SECRET } from "../../config/index.js";

const loginController = {
     async Login(req, res, next){

        // validation
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        });
        const {error} = loginSchema.validate(req.body); 
        if(error){
            return next(error);
        }

        try{
            // find users and check credentials
            const user = await User.findOne({email: req.body.email});

            if(!user){
                return next(CustomErrorHandler.wrongCredentials());
            }

            // compare the password
            const match = await bcrypt.compare(req.body.password, user.password);
            if(!match){
                return next(CustomErrorHandler.wrongCredentials());
            }

            //token
           const access_token = JwtServices.sign({_id: user._id , role: user.role});

           const refresh_token = JwtServices.sign({_id: user._id , role: user.role}, '1y' ,REFRESH_SECRET);

        //database whitelist
            await refreshToken.create({token: refresh_token});

           res.json({access_token, refresh_token})
        }catch(err){
            return next(err);
        }
     },

    async logout(req, res ,next){

        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });
        const {error} = refreshSchema.validate(req.body);

        if(error){
            return next(error);
        }

        try{
            await refreshToken.deleteOne({token: req.body.refresh_token})
        }catch(err){
            return next(new Error('something went wronge in datdabase'));
        }
        res.json({status: 1});
     }
};

export default loginController;