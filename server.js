import express from "express";
import { APP_PORT ,DB_URL} from "./config/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import router from "./routes/index.js";
import mongoose from "mongoose";
// import path from "path";
import cors from 'cors';


const app = express();

app.use(cors());
mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>{
    console.log('db connected')
});

// global.appRoot = path.resolve(__dirname)
// app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/api',router);
app.use('/uploads', express.static('uploads'));

app.use(errorHandler);
const PORT = process.env.APP_PORT || APP_PORT;
app.listen(PORT, ()=>
console.log(`server is lisenting on:${PORT}`));
