import { userModel } from "../persistencia/models/Users.js"

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
    const { email } = req.body
    //Busco ese email en mongodb y lo guardo en user
    const user = await userModel.findOne({ email }).lean().exec()
    //Si se encuentra el usuario, se guarda en la sesión actual del usuario
    req.session.user = user
    const { rol } = req.session.user
    if (rol === "Administrador") { res.redirect('/product/realtimeproductsAdmin') }
    if (rol === "Premium") { res.redirect('/product/realtimeproductsAdmin') }
    if (rol === "Usuario") { res.redirect('/product/realtimeproductsUser') }
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
        if (rol === "Administrador") { res.redirect('/product/realtimeproductsAdmin') }
        if (rol === "Premium") { res.redirect('/product/realtimeproductsAdmin') }
        if (rol === "Usuario") { res.redirect('/product/realtimeproductsUser') }
    } catch (error) {

        logger.warning(error.message, "Error al buscar en la base de datos")
        //console.error('Error al buscar en la base de datos:', error);
        res.redirect('/sessions/login');
    }
}

//Manejo del logout para desturir la sesión que exporto a la ruta 
export const logoutHandler = (req, res) => {
    req.session.destroy(err => {
        if (err) res.status(500).render('errors/base', {
            error: err
        })
        else res.redirect('/sessions/login')
    })
}