import { ticketModel } from '../persistencia/models/Tickets.js'

//Genero una clase TicketManager
export class TicketManager {
    constructor(path) {
        this.path = path
    }

    //Mét create ticket
    async createTicket({ code, purchase_datetime, amount, purchaser }) {
        try {

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