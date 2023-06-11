import { Router } from "express";
import { userModel } from "../models/Users.js";


const router = Router()

//Vista de registro de usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

//Genero nuevo usuario en mongodb
router.post('/register', async (req, res) => {
    const userNew = req.body
    const user = new userModel(userNew)
    await user.save()
    res.redirect('/sessions/login')
})

//Vista de login
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

//Genero acceso a la vista productos
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    //Guardo en user el resultado de la búsqueda en mongodb
    const user = await userModel.findOne({ email, password }).lean().exec()
    //Guardo en coderUser datos de Coder hardcodeados
    const coderUser = {
        nombre: "CoderHouse",
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
        rol: "Administrador"
    }

    //Si email y pass son de coder, doy acceso
    if (user) {
        //Sesión de user
        req.session.user = user
        res.redirect('/product/realtimeproducts')
    }
    //Si user existe, doy acceso
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

//Método para destruir la sesión
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) res.status(500).render('errors/base', {
            error: err
        })
        else res.redirect('/sessions/login')
    })
})

export default router