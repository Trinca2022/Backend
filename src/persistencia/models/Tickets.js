import { Schema, model } from "mongoose";


const ticketSchema = new Schema({ //Defino las propiedades de mi modelo user
    code: Number,
    purchase_datetime: String,
    amount: Number,
    purchaser: {
        type: Schema.Types.ObjectId,
        ref: "sessions",
    },
    id_cart: {
        type: Schema.Types.ObjectId,
        ref: "carts",
    }
})

export const ticketModel = model("tickets", ticketSchema)