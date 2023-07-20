import { cartModel } from "../persistencia/models/Cart.js"
import { ticketModel } from "../persistencia/models/Tickets.js";
import { userModel } from "../persistencia/models/Users.js"
import { UserManager } from "../services/userManager.js";
import { hashData } from "../utils/bcrypt.js";

const userManager = new UserManager()

//Manejo de la vista de registro que exporto a la ruta
export const registerViewHandler = (req, res) => {
    res.render('register/register')
}

/*//Manejo del registro de usuario que exporto a la ruta
export const registerHandler = async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (user) { return res.redirect('errors/base') }
    const hashPassword = await hashData(password)
    //Genero carrito
    const cart = await cartModel.create({ product: [] })
    //Guardo en cartUser el id del carrito
    const cartUser = cart._id
    //Genero user con la info pasada por body, la pass hasheada y el id guardado en cartUser
    await userModel.create({ ...req.body, password: hashPassword, id_cart: cartUser })
    res.redirect('/sessions/login')
}*/

//Manejo del registro de usuario que exporto a la ruta
export const registerHandler = async (req, res) => {
    const { nombre, apellido, email, edad, password } = req.body
    const hashPassword = await hashData(password)
    const cart = await cartModel.create({ product: [] })
    const cartUser = cart._id
    await ticketModel.create()
    await userManager.createUser({ nombre, apellido, email, edad, password: hashPassword, id_cart: cartUser })
    res.redirect('/sessions/login')
}