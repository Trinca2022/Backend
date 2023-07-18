import { TicketManager } from "../services/ticketManager.js";

//Utilizo las funciones creadas en los managers (services), para ejecutar req, res y enviarlo a la ruta
const ticketManager = new TicketManager()

//Creo ticket mediante método POST
export const createTicketHandler = async (req, res) => {
    // const id_cart = req.params.id_cart;
    const cart = req.body
    await ticketManager.createTicket(cart)
    res.send("Ticket creado")
}