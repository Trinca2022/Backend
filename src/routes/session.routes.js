import passport from "passport";
import { Router } from "express";
import { errorloginHandler, loginGithubHandler, loginHandler, loginPassportHandler, logoutHandler } from "../controllers/session.controller.js";

const sessionRouter = Router()

//Vista de login
sessionRouter.get('/login', loginHandler)

//Vista de errorLogin
sessionRouter.get('/errorLogin', errorloginHandler)

//Login con Passport
sessionRouter.post('/login', passport.authenticate('login', {
    failureRedirect: 'errorLogin',
}), loginPassportHandler)

//Registro con github
sessionRouter.get(
    //Uso la estrategia githubRegister para la autenticación a través de Github
    '/githubRegister',
    //El acceso que se permite es al email de Github
    passport.authenticate('githubRegister', { scope: ['user:email'] })
)
//Si la autenticación falla, redirecciono a login
sessionRouter.get('/github', passport.authenticate('githubRegister', { failureRedirect: '/sessions/login' }), loginGithubHandler);

//Método para destruir la sesión
sessionRouter.get('/logout', logoutHandler)

export default sessionRouter

//BORRAR ABAJO





/*//Vista de registro de usuarios --> PASAR A USER ROUTES/CONTROLLER
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

//Genero nuevo usuario en mongodb  --> PASAR A USER ROUTES/CONTROLLER
router.post('/register', async (req, res) => {
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
})*/

/*//Login sin Passport
//Genero acceso a la vista productos
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    //Guardo en user el resultado de la búsqueda en mongodb
    const user = await userModel.findOne({ email }).lean().exec()
    //Guardo en coderUser datos de Coder hardcodeados
    const coderUser = {
        nombre: "CoderHouse",
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
        rol: "Administrador"
    }
    //Si user existe, comparo contraseña hasheada antes de dar acceso
    if (user) {
        //Comparo contraseña
        const isPasswordValid = await compareData(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).render('errors/base', {
                error: 'Email y/o contraseña incorrectos'
            })
        }
        //Sesión de user
        req.session.user = user
        res.redirect('/product/realtimeproducts')
    }
    //Si email y pass son de coder, doy acceso 
    else if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        //Sesión de coderUser
        req.session.coderUser = coderUser
        res.redirect('/product/realtimeproducts')
    }
    else {
        return res.status(401).render('errors/base', {
            error: 'Email y/o contraseña incorrectos'
        })
    }
})
*/
