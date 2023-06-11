import { Schema, model } from "mongoose";


const sessionSchema = new Schema({
    session: {
        nombre: String,
        rol: String
    }
})

export const sessionModel = model("sessions", sessionSchema)