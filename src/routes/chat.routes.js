import { Router } from "express";
import { getMessegesHandler } from "../controllers/chat.controller.js";

const chatRouter = Router()

//Envío el array de mensajes inicial al cliente a través de socket
chatRouter.get("/realtimechat", getMessegesHandler)

export default chatRouter