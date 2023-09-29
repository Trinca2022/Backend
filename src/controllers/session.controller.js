import { userModel } from "../persistencia/models/Users.js"
import { UserManager } from "../services/userManager.js"
import { sessionModel } from "../persistencia/models/Sessions.js"

const userManager = new UserManager()

//Manejo del login que exporto a la ruta
export const loginHandler = (req, res) => {
    res.render('sessions/login')
}

//Manejo del errorLogin que exporto a la ruta 
export const errorloginHandler = (req, res) => {
    res.render('sessions/errorLogin')
}

//Manejo del login con Passport que exporto a la ruta
export const loginPassportHandler = async (req, res) => {
    try {
        const { email } = req.body
        // Buscar ese email en MongoDB y guardarlo en user
        const user = await userModel.findOne({ email }).lean().exec()
        // Si se encuentra el usuario, se guarda en la sesión actual del usuario
        req.session.user = user
        const { rol } = req.session.user
        if (rol === "Administrador") {
            const { _id } = req.session.user
            const fechaHoraActual = new Date();
            const fechaHoraFormateada = fechaHoraActual.toString();
            await userManager.updateUser(_id, { last_connection: fechaHoraFormateada })
            console.log("DATE LOGIN", fechaHoraFormateada)
            res.redirect('/product/realtimeproductsAdmin')
        }
        if (rol === "Premium") {
            const { _id } = req.session.user
            const fechaHoraActual = new Date();
            const fechaHoraFormateada = fechaHoraActual.toString();
            await userManager.updateUser(_id, { last_connection: fechaHoraFormateada })
            console.log("DATE LOGIN", fechaHoraFormateada)
            res.redirect('/product/realtimeproductsAdmin')
        }
        if (rol === "Usuario") {
            const { _id } = req.session.user
            const fechaHoraActual = new Date();
            const fechaHoraFormateada = fechaHoraActual.toString();
            await userManager.updateUser(_id, { last_connection: fechaHoraFormateada })
            console.log("DATE LOGIN", fechaHoraFormateada)
            res.redirect('/product/realtimeproductsUser')
        }
    }
    catch (error) {
        // Manejar errores
        console.error('Error:', error);
        res.redirect('/sessions/login');
    }
}

//Manejo del login con Github que exporto a la ruta
export const loginGithubHandler = async (req, res) => {
    //Si la autenticación funciona, extraigo email de req.user
    try {
        const { email } = req.user;
        // Busco en MongoDB el mail pasado por req y lo guardo en user
        const user = await userModel.findOne({ email }).lean().exec();//lean:obtener obj plano y no un doc de mongoose completo/exec:ejecuta consulta
        //Si se encuentra el usuario, se guarda en la sesión actual del usuario
        req.session.user = user;
        const { rol } = req.session.user
        if (rol === "Administrador") {
            const { _id } = req.session.user
            const fechaHoraActual = new Date();
            const fechaHoraFormateada = fechaHoraActual.toString();
            await userManager.updateUser(_id, { last_connection: fechaHoraFormateada })
            res.redirect('/product/realtimeproductsAdmin')
        }
        if (rol === "Premium") {
            const { _id } = req.session.user
            const fechaHoraActual = new Date();
            const fechaHoraFormateada = fechaHoraActual.toString();
            await userManager.updateUser(_id, { last_connection: fechaHoraFormateada })
            res.redirect('/product/realtimeproductsAdmin')
        }
        if (rol === "Usuario") {
            const { _id } = req.session.user
            const fechaHoraActual = new Date();
            const fechaHoraFormateada = fechaHoraActual.toString();
            await userManager.updateUser(_id, { last_connection: fechaHoraFormateada })
            res.redirect('/product/realtimeproductsUser')
        }
    } catch (error) {

        logger.warning(error.message, "Error al buscar en la base de datos")
        //console.error('Error al buscar en la base de datos:', error);
        res.redirect('/sessions/login');
    }
}

// Manejo del logout para destruir la sesión que exporto a la ruta
export const logoutHandler = async (req, res) => {
    try {
        const latestSession = await sessionModel.findOne().sort({ $natural: -1 }).exec();
        if (latestSession) {
            const data = JSON.parse(latestSession.session);
            const userDatos = data.user;
            const _id = userDatos._id;
            const fechaHoraActual = new Date();
            const fechaHoraFormateada = fechaHoraActual.toString();
            await userManager.updateUser(_id, { last_connection: fechaHoraFormateada });
            console.log("DATE LOGOUT", fechaHoraFormateada)
            await req.session.destroy();
            res.redirect('/sessions/login');
        } else res.redirect('/sessions/login');
    } catch (err) {
        res.status(500).render('errors/base', {
            error: err
        });
    }
};
