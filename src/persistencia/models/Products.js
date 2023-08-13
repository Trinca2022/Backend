import { Schema, model } from "mongoose";
import paginate from 'mongoose-paginate-v2'

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: String,
    code: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    owner: {
        type: String,
        default: "Administrador",
        ref: "users"
    }


})

productSchema.plugin(paginate)
export const productModel = model("products", productSchema)