import dotenv from 'dotenv'
dotenv.config()
export const {
    PORT,
    Debug_Mode,
    DB_URL,
    JWT_SECRET,
    REFRESH_SECRET,
    App_Url
}= process.env;