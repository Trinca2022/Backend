import { ticketModel } from '../persistencia/models/Tickets.js'
import { randomUUID } from 'node:crypto';

//Genero una clase TicketManager
export class TicketManager {
    constructor(path) {
        this.path = path
    }

    //Mét create ticket
    async createTicket(amount, purchaser) {
        try {
            const ticket = await ticketModel.create({
                "code": randomUUID(),
                "purchase_datetime": new Date(),
                "amount": amount,
                "purchaser": purchaser
            })
            return ticket
        }
        catch (error) {
            console.log(error)
        }
    }

}