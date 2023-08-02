import winston from "winston";

const levelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    color: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white',
    }
}

export const logger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        //Para entorno DEV
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.color }),
                winston.format.simple()
            )
        }),
        //Para entorno PROD
        new winston.transports.File({
            filename: "./errors.log", level: "info",
            format: winston.format.simple()
        })
    ]
})


export const addLogger = (req, res, next) => {
    logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next();
}