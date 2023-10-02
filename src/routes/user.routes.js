import { Router } from "express";
import { registerHandler, registerPasswordRecoveryHandler, registerPasswordRecoveryNEWHandler, registerViewHandler, registerViewPasswordRecoveryHandler, registerViewPasswordRecoveryIDHandler, uploadAccountHandler, uploadAdressHandler, uploadFileViewHandler, uploadIdentHandler, uploadProductPicHandler, uploadProfilePicHandler } from "../controllers/user.controller.js";

const userRouter = Router()

//Vista de registro de usuarios
userRouter.get('/register', registerViewHandler)

//Genero nuevo usuario en mongodb
userRouter.post('/register', registerHandler)

//Vista de carga de documentos de usuario
userRouter.get('/:uID/documents', uploadFileViewHandler)

//HACER UNA RUTA /:ID/DOCUMENTS/XXX PARA CADA DOC y dif controllers

//Ruta de carga de documentos de usuario
userRouter.post('/:id/documents/identificacion', uploadIdentHandler)

//Ruta de carga de documentos de usuario
userRouter.post('/:id/documents/domicilio', uploadAdressHandler)

//Ruta de carga de documentos de usuario
userRouter.post('/:id/documents/cuenta', uploadAccountHandler)

//Ruta de carga de documentos de usuario
userRouter.post('/:id/profilePics', uploadProfilePicHandler)

//Ruta de carga de documentos de usuario
userRouter.post('/:id/productPics', uploadProductPicHandler)

//PARA RESTABLECER CONTRSEÑA:

//Vista para envío de email y reestablecer contraseña
userRouter.get('/passwordRecovery', registerViewPasswordRecoveryHandler)

//Vista para reestablecer contraseña
userRouter.get('/passwordRecovery/:id', registerViewPasswordRecoveryIDHandler)

//Genero envío de recovery mailer
userRouter.post('/passwordRecovery', registerPasswordRecoveryHandler)

//Genero nueva pass--> ACTUALIZO USUARIO
userRouter.post('/passwordRecovery/:id', registerPasswordRecoveryNEWHandler)

export default userRouter