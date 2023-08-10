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
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white',
    }
}

export const logger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "warning",
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.color }),
                winston.format.simple()
            )
        }),

        new winston.transports.File({
            filename: "./errors.log", level: "error",
            format: winston.format.simple()
        })
    ]
})

export const devLogger = winston.createLogger({
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

        new winston.transports.File({
            filename: "./errors.log", level: "error",
            format: winston.format.simple()
        })
    ]
})

export const prodLogger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        //Para entorno PROD
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.color }),
                winston.format.simple()
            )
        }),
        //Para entorno PROD
        new winston.transports.File({
            filename: "./errors.log", level: "error",
            format: winston.format.simple()
        })
    ]
})


export const addLogger = (req, res, next) => {
    logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next();
}

/*export const addLogger = (req, res, next) => {
    //Usamos logger dependiendo del modo de ejecucion
    req.logger = options.mode === "production" ? prodLogger : devLogger;
    next();
}*/