import { cartModel } from "../persistencia/models/Cart.js"
import { ticketModel } from "../persistencia/models/Tickets.js";
import { userModel } from "../persistencia/models/Users.js"
import createError from "../services/errors/customError.js";
import errorTypes from "../services/errors/errorTypes.js";
import { UserManager } from "../services/userManager.js";
import { hashData } from "../utils/bcrypt.js";
import { generateUserErrorInfo, generateUserEmailErrorInfo, generateUserPassErrorInfo } from "../services/errors/info.js";
import { logger } from "../utils/logger.js";
import { transporter } from "../utils/nodemailer.js";

const userManager = new UserManager()

//Manejo de la vista de registro que exporto a la ruta
export const registerViewHandler = (req, res) => {
    res.render('register/register')
}

//Manejo de la vista de registro para restablecer contraseña que exporto a la ruta
export const registerViewPasswordRecoveryHandler = (req, res) => {
    res.render('register/passwordRecovery')
}

//Mailer para enviar a recuperar contresña
export const registerPasswordRecoveryHandler = async (req, res, next) => {
    try {
        const users = await userModel.find()
        const { email } = req.body;
        const emailUser = users.find(user => user.email === email)
        if (!emailUser) {
            throw createError(
                {
                    name: "Error de recuperación de contraseña",
                    cause: generateUserPassErrorInfo({ email }),
                    message: "Mail inexistente",
                    code: errorTypes.INVALID_TYPES_ERROR
                })


        }
        await transporter.sendMail({
            to: email,
            subject: 'Restablecer contraseña',
            text: 'LINK'
        })
        res.redirect('/sessions/login')
    }


    catch (error) {
        next(error)
        logger.error(error.message)
    }
}


//Manejo del registro de usuario que exporto a la ruta
export const registerHandler = async (req, res, next) => {
    try {
        const users = await userModel.find()
        const { nombre, apellido, email, edad, password } = req.body;
        if ((!nombre || !apellido || !email || !edad)) {
            throw createError({
                name: "Error de creación de usuario: completar todos los campos solicitados",
                cause: generateUserErrorInfo({ nombre, apellido, email, edad }),
                message: "Error al tratar de crear un nuevo usuario",
                code: errorTypes.INVALID_TYPES_ERROR
            })
        }
        if (users.find(user => user.email === email)) {
            throw createError({
                name: "Error de creación de usuario: elegir otro email",
                cause: generateUserEmailErrorInfo({ email }),
                message: "Usuario ya existe",
                code: errorTypes.INVALID_TYPES_ERROR
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
        logger.error(error.message)
    }
}

