import { Router } from "express";
import { registerHandler, registerPasswordRecoveryHandler, registerPasswordRecoveryNEWHandler, registerViewHandler, registerViewPasswordRecoveryHandler, registerViewPasswordRecoveryIDHandler } from "../controllers/user.controller.js";

const userRouter = Router()

//Vista de registro de usuarios
userRouter.get('/register', registerViewHandler)

//Vista para envío de email y reestablecer contraseña
userRouter.get('/passwordRecovery', registerViewPasswordRecoveryHandler)

//Vista para reestablecer contraseña
userRouter.get('/passwordRecovery/:id', registerViewPasswordRecoveryIDHandler)

//Genero nuevo usuario en mongodb
userRouter.post('/register', registerHandler)

//Genero envío de recovery mailer
userRouter.post('/passwordRecovery', registerPasswordRecoveryHandler)

//Genero nueva pass
userRouter.post('/passwordRecovery', registerPasswordRecoveryNEWHandler)

export default userRouter