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

