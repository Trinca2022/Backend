import { Router } from "express";
import { getMessegesHandler } from "../controllers/chat.controller.js";

const chatRouter = Router()

//Autenticación para poder acceder a la vista de productos
const authUser = (req, res, next) => {
    if (!req.session.user)
        return res.send("Error de autenticación")
    const { rol } = req.session.user
    if (rol === "Usuario") return next()
}

//Envío el array de mensajes inicial al cliente a través de socket
chatRouter.get("/realtimechat", authUser, getMessegesHandler)

export default chatRouter