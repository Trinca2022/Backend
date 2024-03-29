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
import { uploadDocuments, uploadProductPic, uploadProfilePic } from "../index.js";
import multer from "multer";
import config from "../config/config.js";
//import { SessionManager } from "../services/sessionManager.js";


const userManager = new UserManager()
//const sessionManager = new SessionManager()

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
//Mailer para enviar a recuperar contreseña
export const registerPasswordRecoveryHandler = async (req, res, next) => {
    try {
        const users = await userModel.find()
        const { email } = req.body;
        const user = users.find(user => user.email === email)
        //Genero un token unico para el enlace
        const token = crypto.randomBytes(20).toString('hex')
        //Almaceno la hora de expiracion
        const expirationTime = Date.now() + 60 * 60 * 1000;
        // const expirationTime = Date.now() + 60 * 1000;
        // Construyo el enlace
        const enlace = `${config.SITE}/register/passwordRecovery/validation?token=${token}`;
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
            text: `CLICK EN ESTE LINK PARA RESTABLECER CONTRASEÑA: ${enlace}`
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
        let result = await userManager.createUser({ nombre, apellido, email, edad, password: hashPassword, id_cart: cartUser })
        console.log(result)
        const alertScript = `
         <script>
             alert('Usuario creado!');
             window.location.href = '/sessions/login';
         </script>
     `;
        res.send(alertScript);
        // res.send({ status: "success", payload: result[0] });




    }
    catch (error) {
        next(error)
        logger.error(error.message)
    }
}


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
            console.log("ERROR!! PASS COINCIDE");
            res.send("Elegir otra contraseña");
        }
        //Si la pass no es igual a la anterior, la actualiza
        else {
            const hashPassword = await hashData(password)
            await userManager.updateUser(userID, {
                nombre, apellido, edad, rol, password: hashPassword, userIDCart
            });
            const alertScript = `
        <script>
            alert('Contraseña restablecida');
            window.location.href = '/sessions/login';
        </script>
    `;
            res.send(alertScript);
        }
    }
    catch (error) {
        next(error)
        logger.error(error.message)
    }
}

//VISTA carga de archivos
export const uploadFileViewHandler = (req, res) => {
    try {
        const uID = req.session.user.id
        // res.render('uploadFile', { uID, layout: 'mainrealtime' })
        res.render('register/uploadFile', uID)
    }
    catch (error) {
        console.log(error)
        next(error)
    }

}


// Controlador de carga para Identificación
export const uploadIdentHandler = async (req, res, next) => {
    try {
        const uID = req.session.user._id
        // Se cargan docs con Multer
        uploadDocuments.single('identificacion')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.error('Error de Multer:', err.message);
                res.status(400).send('Error de Multer: ' + err.message);
            } else if (err) {
                console.error('Error en la carga de los archivos:', err);
                res.status(500).send('Ocurrió un error en la carga de los archivos');
            } else {
                // const _id = await sessionManager.findIdSession()
                const userFound = await userManager.getUserById(uID)
                await userFound.documents.push({
                    name: 'identificacion.pdf',
                    reference: '/public/archivos/documents'
                });
                userManager.updateUser(uID, { documents: userFound.documents });
                res.send("Carga exitosa de documento");
            }
        });
    } catch (error) {
        next(error);
    }
};

// Controlador de carga para Comprobante de Domicilio
export const uploadAdressHandler = async (req, res, next) => {
    try {
        const uID = req.session.user._id
        uploadDocuments.single('domicilio')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.error('Error de Multer:', err.message);
                res.status(400).send('Error de Multer: ' + err.message);
            } else if (err) {
                console.error('Error en la carga de los archivos:', err);
                res.status(500).send('Ocurrió un error en la carga de los archivos');
            } else {
                // const _id = await sessionManager.findIdSession()
                const userFound = await userManager.getUserById(uID)
                await userFound.documents.push({
                    name: 'domicilio.pdf',
                    reference: '/public/archivos/documents'
                });
                userManager.updateUser(uID, { documents: userFound.documents });
                res.send("Carga exitosa de documento");

            }
        });
    } catch (error) {
        next(error);
    }
};

// Controlador de carga para Comprobante de Estado de Cuenta
export const uploadAccountHandler = async (req, res, next) => {
    try {
        const uID = req.session.user._id
        uploadDocuments.single('estadoCuenta')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.error('Error de Multer:', err.message);
                res.status(400).send('Error de Multer: ' + err.message);
            } else if (err) {
                console.error('Error en la carga de los archivos:', err);
                res.status(500).send('Ocurrió un error en la carga de los archivos');
            } else {
                // const _id = await sessionManager.findIdSession()
                const userFound = await userManager.getUserById(uID)
                await userFound.documents.push({
                    name: 'estadoCuenta.pdf',
                    reference: '/public/archivos/documents'
                });
                userManager.updateUser(uID, { documents: userFound.documents });
                res.send("Carga exitosa de documento");
            }
        });
    } catch (error) {
        next(error);
    }
};

// Controlador de carga para Foto de Perfil
export const uploadProfilePicHandler = async (req, res, next) => {
    try {
        const uID = req.session.user._id
        uploadProfilePic.single('profilePic')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.error('Error de Multer:', err.message);
                res.status(400).send('Error de Multer: ' + err.message);
            } else if (err) {
                console.error('Error en la carga de los archivos:', err);
                res.status(500).send('Ocurrió un error en la carga de los archivos');
            } else {
                // const _id = await sessionManager.findIdSession()
                //console.log("_id", _id)
                const userFound = await userManager.getUserById(uID)

                await userFound.documents.push({
                    name: 'profilePic.jpg',
                    reference: '/public/archivos/profiles'
                });
                userManager.updateUser(uID, { documents: userFound.documents });
                res.send("Carga exitosa de foto de perfil");
            }
        });
    } catch (error) {
        next(error);
    }
};

// Controlador de carga para Foto de Producto
export const uploadProductPicHandler = async (req, res, next) => {
    try {
        const uID = req.session.user._id
        uploadProductPic.single('productPic')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.error('Error de Multer:', err.message);
                res.status(400).send('Error de Multer: ' + err.message);
            } else if (err) {
                console.error('Error en la carga de los archivos:', err);
                res.status(500).send('Ocurrió un error en la carga de los archivos');
            } else {
                //  const _id = await sessionManager.findIdSession()
                const userFound = await userManager.getUserById(uID)
                await userFound.documents.push({
                    name: 'productPic.jpg',
                    reference: '/public/archivos/products'
                });
                userManager.updateUser(uID, { documents: userFound.documents });
                res.send("Carga exitosa de foto de producto");
            }
        });
    } catch (error) {
        next(error);
    }
};