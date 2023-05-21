import { messageModel } from './models/Messages.js'

//Genero una clase ProductManager con el elemento products que es un array vacío y la ruta a info.txt
export class ChatManager {
    constructor(path) {
        this.path = path

    }

    async addChat(chat) {
        try {
            const msg = await messageModel.find()
            //Validación de campo faltante
            if ((chat.mail && chat.message) === undefined)
                console.log("Error: falta campo")
            //Carga el nuevo producto
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

    //Método getProducts --> con mongoose
    async getMessages() {
        const chat = await messageModel.find()
        return chat
    }

}