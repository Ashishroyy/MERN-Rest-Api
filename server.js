import express from "express";
import { PORT ,DB_URL} from "./config/index.js";
import errorHandler from "./middlewares/errorHandler.js";
const app = express();
import router from "./routes/index.js";
import mongoose from "mongoose";
import path from "path";

mongoose.connect(DB_URL, {useNewUrlParser: true}, {useUnifiedTopology: true}, {useFindAndModify: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>{
    console.log('db connected sucsessfully..')
});

global.appRoot = path.resolve();
app.use(express.urlencoded({extended: false}));

app.use(express.json());
app.use('/api',router);
app.use('/uploads', express.static('uploads'));
app.use(errorHandler);
app.listen(PORT, ()=>
console.log(`server is lisenting on:${PORT}`)
)
