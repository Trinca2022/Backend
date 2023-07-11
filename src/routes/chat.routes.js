import { Router } from "express";
import { ChatManager } from "../persistencia/chatManager.js";

const chatManager = new ChatManager()

const chatRouter = Router()

//Envío el array de productos inicial al cliente a través de socket
chatRouter.get("/realtimechat", async (req, res, next) => {
    try {
        const messages = await chatManager.getMessages()
        //Envío array al cliente para renderizar
        res.render('realtimechat', { messages: messages, layout: 'mainrealtime' })
    }
    catch (error) {
        next(error)
    }
})

export default chatRouter