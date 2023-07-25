import { ticketModel } from '../persistencia/models/Tickets.js'
import { CartManager } from './cartManager.js'
import { randomUUID } from 'node:crypto';

//Genero una clase TicketManager
export class TicketManager {
    constructor(path) {
        this.path = path
    }

    //Mét create ticket
    async createTicket({ code, purchase_datetime, amount, purchaser }) {
        try {
            const ticket = {
                code: randomUUID(),
                purchase_datetime: new Date(),
                amount: "" //cartManager.totalAmount(),


            }



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