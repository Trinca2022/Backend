import { Schema, model } from "mongoose";


const sessionSchema = new Schema({
    session: {}
})

export const sessionModel = model("sessions", sessionSchema)