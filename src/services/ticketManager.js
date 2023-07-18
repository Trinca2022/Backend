import { ticketModel } from '../persistencia/models/Tickets.js'

//Genero una clase TicketManager
export class TicketManager {
    constructor(path) {
        this.path = path
    }

    //Mét create ticket
    async createTicket() {
        try {
            const tickets = await ticketModel.find()
            if (tickets.length === 0) {
                await ticketModel.create([])
                return "Carrito creado"
            }
            else return
        }
        catch (error) {
            console.log(error)
        }
    }

}