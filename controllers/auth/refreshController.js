import Joi from "joi";
import { REFRESH_SECRET } from "../../config/index.js";
import User from '../../models/User.js';
import RefreshToken from "../../models/refreshTokens.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import JwtServices from '../../services/JwtServices.js';



const refreshController = {
    async refresh(req, res, next) {

        //validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });
        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        //datdabase
        let refreshtoken;
        try {
            refreshtoken = await RefreshToken.findOne({ token: req.body.refresh_token });
            if (!refreshtoken) {
                return next(CustomErrorHandler.unAthorized('Invalid refresh token'))
            }

            let userId;
            try {
                const { _id } = await JwtServices.verify(refreshtoken.token, REFRESH_SECRET);
                userId = _id;
            } catch (err) {
                return next(CustomErrorHandler.unAthorized('Invalid refresh token'))
            }

            const user = await User.findOne({ _id: userId })
            if (!user) {
                return next(CustomErrorHandler.unAthorized('user not found'))
            }
            //token
            const access_token = JwtServices.sign({ _id: user._id, role: user.role })

            const refresh_token = JwtServices.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

            // database whitelist
            await RefreshToken.create({ token: refresh_token })

            res.json({ access_token, refresh_token })

        } catch (err) {
            return next(new Error('Something went wrong' + err.message));
        }

    }
}

export default refreshController;