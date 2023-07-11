import mongoose from 'mongoose'

//Conexión con mongoose
mongoose.connect(process.env.URL_MONGODB_ATLAS)
    .then(() => console.log("DB is connected"))
    .catch((error) => console.log("Errror en MongoDB Atlas :", error))