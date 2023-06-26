import { Router } from "express";
import { userModel } from "../models/Users.js";
import { hashData, compareData } from "../index.js";
import passport from "passport";

const router = Router()

//Vista de registro de usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})


//Genero nuevo usuario en mongodb
router.post('/register', async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (user) { return res.redirect('errors/base') }
    const hashPassword = await hashData(password)
    await userModel.create({ ...req.body, password: hashPassword })
    res.redirect('/sessions/login')
})

//Vista de login
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

//Vista de errorLogin
router.get('/errorLogin', (req, res) => {
    res.render('sessions/errorLogin')
})

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

//Login con Passport
router.post('/login', passport.authenticate('login', {
    failureRedirect: 'errorLogin',
}), async (req, res) => {
    const { email } = req.body
    //Guardo en user el resultado de la búsqueda en mongodb
    const user = await userModel.findOne({ email }).lean().exec()
    //Sesión de user
    req.session.user = user
    res.redirect('/product/realtimeproducts')
}


)

//Método para destruir la sesión
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) res.status(500).render('errors/base', {
            error: err
        })
        else res.redirect('/sessions/login')
    })
})

//Registro con github
router.get(
    '/githubRegister',
    passport.authenticate('githubRegister', { scope: ['user:email'] })
)

router.get('/github',
    passport.authenticate('githubRegister', { failureRedirect: '/sessions/login' }),
    (req, res) => {
        const { email } = req.body
        //Guardo en user el resultado de la búsqueda en mongodb
        const user = userModel.findOne({ email }).lean().exec()
        //Sesión de user
        req.session.user = user
        // Successful authentication, redirect home.
        res.redirect('/product/realtimeproducts');
    });

export default router