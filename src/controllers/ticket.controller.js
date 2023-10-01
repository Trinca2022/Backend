import { TicketManager } from "../services/ticketManager.js";

//Utilizo las funciones creadas en los managers (services), para ejecutar req, res y enviarlo a la ruta
const ticketManager = new TicketManager()

//Creo ticket mediante método POST
export const createTicketHandler = async (req, res) => {
    const { code, purchase_datetime, amount, purchaser } = req.body
    //await ticketManager.createTicket()
    if (amount !== 0) {
        const ticket = await ticketManager.createTicket({ code, purchase_datetime, amount, purchaser })
        res.send(ticket)
    }
    else { res.send("Carrito vacío!") }
}
/*
export const ticketHandler = async (req, res, next) => {
    try {
        //const user = req.session.user
        // const cartID = user.id_cart.toString()

        const isPremium = req.session.user.rol === "Premium"
        const isAdmin = req.session.user.rol === "Administrador"

        const products = await productModel.find()
        //Envío array al cliente para renderizar
        res.render('realtimeproductsAdmin', { adminOrPremiumEmail, cartID, isPremium, isAdmin, products: products, layout: 'mainrealtime' })
    }
    catch (error) {
        console.log(error)
        next(error)
    }
}*/