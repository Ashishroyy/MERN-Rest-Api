import Joi from "joi";
import bcrypt from 'bcrypt';
import User from '../../models/User.js';
import refreshTokens from "../../models/refreshTokens.js";
import JwtServices from "../../services/JwtServices.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import { REFRESH_SECRET } from "../../config/index.js";

const registerController = {
    async register(req, res, next) {

        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        });

        const { error } = registerSchema.validate(req.body)
        if (error) {
            return next(error);
        }
        // check if user is in the database already
        try {
            const exist = await User.exists({ email: req.body.email });
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This email is allready exist'));
            }

        } catch (err) {
            return next(err);
        }
        const { name, email, password } = req.body;

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // prepare model
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        let access_token;
        let refresh_token;
        try {
            const result = await user.save();
            //token
            access_token = JwtServices.sign({ _id: result._id, role: result.role });

            refresh_token = JwtServices.sign({ _id: result._id, role: result.role }, '1y', REFRESH_SECRET);

            // refresh token whitelist
            await refreshTokens.create({ token: refresh_token })

        } catch (err) {
            return next(err);
        }
        res.json({ access_token, refresh_token });
    }
};

export default registerController;