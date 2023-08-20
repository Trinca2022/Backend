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
import { compareData } from "../utils/bcrypt.js";
import crypto from 'crypto'


const userManager = new UserManager()

//Manejo de la VISTA de registro que exporto a la ruta
export const registerViewHandler = (req, res) => {
    res.render('register/register')
}

//Manejo de la VISTA de registro para MANDAR MAIL y restablecer contraseña que exporto a la ruta.
export const registerViewPasswordRecoveryHandler = (req, res) => {
    res.render('register/passwordRecovery')
}
//Genero y almaceno enlaces con su tiempo de ejecucion
const links = {}
//Mailer para enviar a recuperar contresña
export const registerPasswordRecoveryHandler = async (req, res, next) => {
    try {
        const users = await userModel.find()
        const { email } = req.body;
        const user = users.find(user => user.email === email)
        const userID = user._id.toString()

        //Genero un token unico para el enlace
        const token = crypto.randomBytes(20).toString('hex')
        //Almaceno la hora de expiracion
        const expirationTime = Date.now() + 1 * 60 * 1000;
        // Construyo el enlace
        const enlace = ` http://localhost:4000/register/passwordRecovery/validation?token=${token}`;
        // Almaceno el enlace y su tiempo de expiración
        links[token] = expirationTime;
        if (!user) {
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
            text: `LINK: ${enlace}`
        })
        res.redirect('/sessions/login')
    }
    catch (error) {
        next(error)
        logger.error(error.message)
    }
}
//Manejo de la VISTA de registro para restablecer contraseña que exporto a la ruta
export const registerViewPasswordRecoveryIDHandler = async (req, res) => {
    const { token } = req.query
    // Verificar si el enlace ha expirado
    if (links[token] && (Date.now() < links[token])) {
        // Realizar la acción correspondiente al enlace válido
        res.render(`register/passwordRecoveryPass`);
    } else {
        const alertScript = `
        <script>
            alert('Ha expirado el tiempo para restablecer la contraseña, solicitar nuevamente');
            window.location.href = '/sessions/login';
        </script>
    `;
        res.send(alertScript);
    }
}


//Manejo del registro de usuario que exporto a la ruta
export const registerHandler = async (req, res, next) => {
    try {
        const users = await userModel.find()
        const { nombre, apellido, email, edad, password } = req.body;
        if ((!nombre || !apellido || !email || !edad)) {
            {
                throw createError({
                    name: "Error de creación de usuario: completar todos los campos solicitados",
                    cause: generateUserErrorInfo({ nombre, apellido, email, edad }),
                    message: "Error al tratar de crear un nuevo usuario",
                    code: errorTypes.INVALID_TYPES_ERROR
                })
            }
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
        await userManager.createUser({ nombre, apellido, email, edad, password: hashPassword, id_cart: cartUser })
        const alertScript = `
        <script>
            alert('Usuario creado!');
            window.location.href = '/sessions/login';
        </script>
    `;
        res.send(alertScript);


    }
    catch (error) {
        next(error)
        logger.error(error.message)
    }
}


/*
//Mailer para enviar a recuperar contresña
export const registerPasswordRecoveryHandler = async (req, res, next) => {
    try {
        const users = await userModel.find()
        const { email } = req.body;
        const user = users.find(user => user.email === email)
        const userID = user._id.toString()

        if (!user) {
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
            text: `LINK: http://localhost:4000/register/passwordRecovery/${userID}`
        })
        res.redirect('/sessions/login')
    }
    catch (error) {
        next(error)
        logger.error(error.message)
    }
}
*/


//Manejo de generación de nueva pass que mando a la ruta
export const registerPasswordRecoveryNEWHandler = async (req, res, next) => {
    try {
        const users = await userModel.find()
        const { email, password } = req.body;
        const user = users.find(user => user.email === email)
        const userID = user._id.toString()
        const userIDCart = user.id_cart.toString()
        const { nombre, apellido, edad, rol } = user;
        const isOldPassword = await compareData(password, user.password)
        //Si la pass coincide, no permite avanzar
        if (isOldPassword) {
            console.log("ERROR!! PASS COINCIDE")
            res.send("Elegir otra contraseña")
        }
        //Si la pass no es igual a la anterior, la actualiza
        else {
            const hashPassword = await hashData(password)
            await userManager.updateUser(userID, {
                nombre, apellido, edad, rol, password: hashPassword, userIDCart
            });
            res.send("Contraseña restablecida")
        }
    }
    catch (error) {
        next(error)
        logger.error(error.message)
    }
}





