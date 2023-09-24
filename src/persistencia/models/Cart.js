import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: {
        type: [
            {
                "_id": false,
                id_prod: {
                    type: Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: Number,
                price: Number

            }
        ],
        default: []
    }
})

export const cartModel = model("carts", cartSchema)
