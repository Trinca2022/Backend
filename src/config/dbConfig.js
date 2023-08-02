import mongoose from 'mongoose'
import config from '../config.js'

//Conexión con mongoose
//mongoose.connect(process.env.URL_MONGODB_ATLAS)
mongoose.connect(config.URL_MONGODB_ATLAS)
    .then(() => console.log("DB is connected"))
    .catch((error) => console.log("Errror en MongoDB Atlas :", error))