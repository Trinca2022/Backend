import { Router } from "express";

const loggerRouter = Router()

//PETICIÓN PARA ENTORNO DE PROD DESDE EL NIVEL DE INFO
loggerRouter.get('/', (req, res) => {
    //Peticion con info
    req.logger.http("INFO")

    res.send({ message: "Logger para entorno producción" })
})

export default loggerRouter