import { cartModel } from "../persistencia/models/Cart.js"
import { userModel } from "../persistencia/models/Users.js"
import { hashData } from "../utils/bcrypt.js";
import { logger } from "../utils/logger.js";
import createError from "../services/errors/customError.js";
import errorTypes from "../services/errors/errorTypes.js";

export class UserManager {
    constructor(path) {
        this.path = path
    }

    async createUser(user, email) {
        try {
            const users = await userModel.find()
            if ((!user.nombre || !user.apellido || !user.email || !user.edad || !user.password))
                console.log("Error: falta campo")
            else if (users.find(user => user.email === email)) {

                console.log("Usuario ya existe")
            }
            else {
                users.push(user)
            }
            await userModel.create(users)
            return "Usuario creado"
        }
        catch (error) {
            logger.warning(error.message, "Usuario ya existe")
        }
    }
}






