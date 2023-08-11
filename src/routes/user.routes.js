import { Router } from "express";
import { registerHandler, registerPasswordRecoveryHandler, registerViewHandler, registerViewPasswordRecoveryHandler } from "../controllers/user.controller.js";

const userRouter = Router()

//Vista de registro de usuarios
userRouter.get('/register', registerViewHandler)

//Vista para reestablecer contraseña
userRouter.get('/passwordRecovery', registerViewPasswordRecoveryHandler)

//Genero nuevo usuario en mongodb
userRouter.post('/register', registerHandler)

//Genero envío de recovery mailer
userRouter.post('/passwordRecovery', registerPasswordRecoveryHandler)

export default userRouter