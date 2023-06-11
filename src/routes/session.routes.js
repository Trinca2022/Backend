import { Router } from "express";
import { userModel } from "../models/user.js";


const router = Router()

//Vista de registro de usuarios
router.get('/register', (req, res) => {
    res.render('sessions/register')
})

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

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email, password }).lean().exec()
    if (email === "adminCoder@coder.com" && password === "adminCod3r123" || user) {
        req.session.login = true
        res.redirect('/product/realtimeproducts')
    }
    else {
        return res.status(401).render('errors/base', {
            error: 'Email y/o contraseña incorrectos'
        })
    }


    /*if (!user) {
        return res.status(401).render('errors/base', {
            error: 'Email y/o contraseña incorrectos'
        })
    }
    //Genero la Sesion de mi usuario
    req.session.user = user
    res.redirect('/product/realtimeproducts')
    */
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