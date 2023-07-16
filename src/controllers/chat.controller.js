import { ChatManager } from "../services/chatManager.js";

//Utilizo las funciones creadas en los managers (services), para ejecutar req, res y enviarlo a la ruta
const chatManager = new ChatManager()

//Manejo de función que consulta mensajes
//Envío el array de mensajes inicial al cliente a través de socket
export const getMessegesHandler = async (req, res, next) => {
    try {
        const messages = await chatManager.getMessages()
        //Envío array al cliente para renderizar
        res.render('realtimechat', { messages: messages, layout: 'mainrealtime' })
    }
    catch (error) {
        next(error)
    }
}
