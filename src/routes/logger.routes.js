import { Router } from "express";
import { logger } from "../utils/logger.js";

const loggerRouter = Router()

//PETICIONES
loggerRouter.get('/', (req, res) => {
    logger.debug("Debug");
    logger.http("Http");
    logger.info("Info");
    logger.warning("Warning");
    logger.error("Error");
    logger.fatal("Fatal");
    res.send({ message: "Logger test" })
})

export default loggerRouter