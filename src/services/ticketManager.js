import { ticketModel } from '../persistencia/models/Tickets.js'
import { CartManager } from './cartManager.js'

//Genero una clase TicketManager
export class TicketManager {
    constructor(path) {
        this.path = path
    }

    //Mét create ticket
    async createTicket({ code, purchase_datetime, amount, purchaser }) {
        try {

            //Defino CODE -- > arreglar!!!!!!!
            const carts = await cartModel.find()
            for (let i = 1; i <= carts.length; i++)
                code = i

            //Defino fecha y hora
            purchase_datetime = new Date()

            //Defino amount
            amount = //cartManager.totalAmount()

                await ticketModel.create({
                    "code": code,
                    "purchase_datetime": purchase_datetime,
                    "amount": amount,
                    "purchaser": purchaser
                })
            return "Ticket creado"


        }
        catch (error) {
            console.log(error)
        }
    }

}