import { TicketManager } from "../services/ticketManager.js";

//Utilizo las funciones creadas en los managers (services), para ejecutar req, res y enviarlo a la ruta
const ticketManager = new TicketManager()

//Creo ticket mediante método POST
export const createTicketHandler = async (req, res) => {
    const { code, purchase_datetime, amount, purchaser } = req.body
    //await ticketManager.createTicket()
    const ticket = await ticketManager.createTicket({ code, purchase_datetime, amount, purchaser })
    res.send(ticket)
}