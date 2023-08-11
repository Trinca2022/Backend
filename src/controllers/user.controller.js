import { cartModel } from "../persistencia/models/Cart.js"
import { ticketModel } from "../persistencia/models/Tickets.js";
import { userModel } from "../persistencia/models/Users.js"
import createError from "../services/errors/customError.js";
import errorTypes from "../services/errors/errorTypes.js";
import { UserManager } from "../services/userManager.js";
import { hashData } from "../utils/bcrypt.js";
import { generateUserErrorInfo } from "../services/errors/info.js";
import { generateUserEmailErrorInfo } from "../services/errors/info.js";
import { logger } from "../utils/logger.js";
import { transporter } from "../utils/nodemailer.js";

const userManager = new UserManager()

//Manejo de la vista de registro que exporto a la ruta
export const registerViewHandler = (req, res) => {
    res.render('register/register')
}

//Manejo del registro de usuario que exporto a la ruta
export const registerHandler = async (req, res, next) => {
    try {
        const users = await userModel.find()
        const { nombre, apellido, email, edad, password } = req.body;
        if ((!nombre || !apellido || !email || !edad)) {
            throw createError({
                name: "Error de creación de usuario",
                cause: generateUserErrorInfo({ nombre, apellido, email, edad }),
                message: "Error al tratar de crear un nuevo usuario",
                code: errorTypes.INVALID_TYPES_ERROR
            })
        }
        if (users.find(user => user.email === email)) {
            throw createError({
                name: "Error de creación de usuario",
                cause: generateUserEmailErrorInfo({ email }),
                message: "Usuario ya existe. Elegir otro email",
                code: errorTypes.DATABASE_ERROR
            })
        }
        const hashPassword = await hashData(password)
        const cart = await cartModel.create({ product: [] })
        const cartUser = cart._id
        await ticketModel.create()
        await transporter.sendMail({
            to: email,
            subject: 'BIENVENIDO A CAFÉ DON JULIO',
            text: '¡Muchas gracias!'
        })
        await userManager.createUser({ nombre, apellido, email, edad, password: hashPassword, id_cart: cartUser })
        res.redirect('/sessions/login')

    }
    catch (error) {
        next(error)
        logger.error(error.message, "FALTA CAMPO")
    }
}

