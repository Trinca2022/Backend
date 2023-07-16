import { messageModel } from '../persistencia/models/Messages.js'

//Genero una clase ChatManager con la ruta
export class ChatManager {
    constructor(path) {
        this.path = path
    }

    //Genero nuevo método createChats que carga msjs a mongodb
    async createChats() {
        try {
            const chats = await messageModel.find()
            if (chats.length === 0)
                await messageModel.create([
                    { mail: "asd@asd", message: "Hola" }
                ])
            else
                return

        }
        catch (error) {
            console.log(error)
        }
    }

    async addChat(chat) {
        try {
            const msg = await messageModel.find()
            //Validación de campo faltante
            if ((chat.mail && chat.message) === undefined)
                console.log("Error: falta campo")
            //Carga el nuevo chat
            else {
                msg.push(chat)
            }
            await messageModel.create(msg)
            return "Mensaje creado"
        }
        catch (error) {
            console.log(error)
        }
    }

    //Método getMessages --> con mongoose
    async getMessages() {
        const chat = await messageModel.find()
        return chat
    }

}