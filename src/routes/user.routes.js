import { Router } from "express";
import { registerHandler, registerViewHandler } from "../controllers/user.controller.js";

const userRouter = Router()

//Vista de registro de usuarios
userRouter.get('/register', registerViewHandler)

//Genero nuevo usuario en mongodb
userRouter.post('/register', registerHandler)

export default userRouter