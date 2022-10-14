import { Debug_Mode } from "../config/index.js";
import  ValidationError  from "joi";
import CustomErrorHandler from "../services/CustomerrorHandler.js";
const errorHandler = (err, req, res, next) =>{
    let statusCode = 500;
    let data = {
        message: 'internal server error',
        ...(Debug_Mode === 'true' &&{originalError: err.message})
    }

    if (err, ValidationError) {
        statusCode = 422;
        data = {
            message: err.message
        }
    }


    if (err instanceof CustomErrorHandler) {
        statusCode = err.status;
        data = {
            message: err.message
        }
    }
        return res.status(statusCode).json(data)
        
    }


export default errorHandler;