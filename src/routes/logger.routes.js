import { Router } from "express";
import { logger } from "../utils/logger.js";

const loggerRouter = Router()

//PETICIÓN PARA ENTORNO DE PROD DESDE EL NIVEL DE INFO
loggerRouter.get('/', (req, res) => {
    //Peticion con info
    logger.info("INFO")
    res.send({ message: "Logger para entorno producción" })
})

export default loggerRouter