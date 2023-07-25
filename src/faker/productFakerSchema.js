import { Schema, model } from "mongoose";

const productFakerSchema = new Schema({
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
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }


})

export const productFakerModel = model("productsFaker", productFakerSchema)