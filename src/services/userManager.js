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

    async getUserById(id) {
        const userFound = await userModel.findById(id)
        if (userFound) {
            return ("Usuario encontrado:", userFound)
        }
        else return "Usuario no encontrado"
    }

    //Método updateUser --> actualiza campo de un producto con un ID existente --> REPETIR TODO Y SOLO ACTUALIZAR PASS
    async updateUser(id, password) {
        const userFound = await userModel.findById(id)
        if (userFound) {
            await userModel.updateOne(id, obj),
            //await productMongo.updateOne({ "_id": id }, 
            {
                $set: {
                    "password": password,

                }
            }

            await userModel.create()
            return (`La contraseña del usuario cuyo id es ${userFound.id} se ha actualizado`)
        }
        else
            return 'Not found'
    }


}






