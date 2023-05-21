import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: {
        type: [
            {
                id_prod: {
                    type: Schema.Types.ObjectId,
                    ref: "products"
                },
                cant: Number
            }
        ],
        default: []
    }
})

export const cartModel = model("carts", cartSchema)
