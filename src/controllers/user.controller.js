import { cartModel } from "../persistencia/models/Cart.js"
import { ticketModel } from "../persistencia/models/Tickets.js";
import { userModel } from "../persistencia/models/Users.js"
import createError from "../services/errors/customError.js";
import errorTypes from "../services/errors/errorTypes.js";
import { UserManager } from "../services/userManager.js";
import { hashData } from "../utils/bcrypt.js";
import { generateUserErrorInfo } from "../services/errors/info.js";

const userManager = new UserManager()

//Manejo de la vista de registro que exporto a la ruta
export const registerViewHandler = (req, res) => {
    res.render('register/register')
}

//Manejo del registro de usuario que exporto a la ruta
export const registerHandler = async (req, res, next) => {
    try {
        const { nombre, apellido, email, edad, password } = req.body;
        if ((!nombre || !apellido || !email || !edad)) {
            createError({
                name: "Error de creación de usuario",
                cause: generateUserErrorInfo({ nombre, apellido, email, edad }),
                message: "Error al tratar de crear un nuevo usuario",
                code: errorTypes.INVALID_TYPES_ERROR
            })
        }
        const hashPassword = await hashData(password)
        const cart = await cartModel.create({ product: [] })
        const cartUser = cart._id
        await ticketModel.create()
        await userManager.createUser({ nombre, apellido, email, edad, password: hashPassword, id_cart: cartUser })
        res.redirect('/sessions/login')
    }
    catch (error) {
        next(error)
    }
}

