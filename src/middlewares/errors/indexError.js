import errorTypes from "../../services/errors/errorTypes.js"

const errorHandler = (error, req, res, next) => {
    console.log(error.cause)
    switch (error.code) {
        case errorTypes.INVALID_TYPES_ERROR:
            res.send({ status: "error", error: error.name })
            break;
        default:
            res.send({ status: "error", error: "Unhandled error" })
    }
}

export default errorHandler