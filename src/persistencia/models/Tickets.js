import { Schema, model } from "mongoose";


const ticketSchema = new Schema({ //Defino las propiedades de mi modelo user
    code: Number,
    purchase_datetime: String,
    amount: Number,
    purchaser: String
})

export const ticketModel = model("tickets", ticketSchema)