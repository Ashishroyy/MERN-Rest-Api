import mongoose from 'mongoose';
import { App_Url } from '../config/index.js';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    image: { type: String, required: true , get: (image) =>{

        return `${App_Url}/${image}`;
    }},
    // role: { type: String, default: 'customer' },
}, { timestamps: true , toJSON:{getters: true}, id: false});

export default mongoose.model('Product', productSchema, 'products');
