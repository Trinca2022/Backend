import { Router } from "express";
import { registerHandler, registerPasswordRecoveryHandler, registerPasswordRecoveryNEWHandler, registerViewHandler, registerViewPasswordRecoveryHandler, registerViewPasswordRecoveryIDHandler, uploadFileHandler, uploadFileViewHandler } from "../controllers/user.controller.js";

const userRouter = Router()

//Vista de registro de usuarios
userRouter.get('/register', registerViewHandler)

//Genero nuevo usuario en mongodb
userRouter.post('/register', registerHandler)

//Vista de carga de documentos de usuario
userRouter.get('/:id/documents', uploadFileViewHandler)

//Ruta de carga de documentos de usuario
userRouter.post('/:id/documents', uploadFileHandler)

//PARA RESTABLECER CONTRSEÑA:

//Vista para envío de email y reestablecer contraseña
userRouter.get('/passwordRecovery', registerViewPasswordRecoveryHandler)

//Vista para reestablecer contraseña
userRouter.get('/passwordRecovery/:id', registerViewPasswordRecoveryIDHandler)

//Genero envío de recovery mailer
userRouter.post('/passwordRecovery', registerPasswordRecoveryHandler)

//Genero nueva pass--> ACTUALIZO USUARIO
userRouter.post('/passwordRecovery/:id', registerPasswordRecoveryNEWHandler)



/*
userRouter.post('/passwordRecovery/:id', async (req, res, next) => {
    try {
        const paramID = req.params.id;
        const bodyID = req.body.id;

        // Verifica si hay un ID en el cuerpo de la solicitud, de lo contrario, utiliza el ID de la ruta
        const idToUse = bodyID || paramID;

        if (!idToUse) {
            return res.status(400).json({ error: "Missing ID in request." });
        }

        const user = await UserManager.getUserById(idToUse);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const userID = user._id.toString();
        console.log("userriddd", userID);

        // Resto del código de la función

        // Redirige a la misma URL, manteniendo el ID en la ruta
        res.redirect(`/passwordRecovery/${idToUse}`);
    } catch (error) {
        next(error);
        //logger.error(error.message);
    }
});
*/

export default userRouter