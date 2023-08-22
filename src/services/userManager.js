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

    async findAllUsers() {
        try {
            const response = await userModel.find()
            return response
        } catch (error) {
            return error
        }
    }

    async getUserById(id) {
        const userFound = await userModel.findById(id)
        if (userFound) {
            return ("Usuario encontrado:", userFound)
        }
        else return "Usuario no encontrado"
    }

    //Método updateUser 
    async updateUser(id, { nombre,
        apellido,
        edad,
        rol,
        password,
        id_cart }) {
        try {
            const updatedUser = await userModel.findOneAndUpdate(
                { "_id": id }, {
                $set: {
                    "nombre": nombre,
                    "apellido": apellido,

                    "edad": edad,
                    "rol": rol,
                    "password": password,
                    "id_cart": id_cart
                }
            },
                { new: true } // Devuelve el documento actualizado
            );

            if (updatedUser) {
                return `El usuario con ID ${updatedUser._id} se ha actualizado correctamente.`;
            } else {
                return 'Usuario no encontrado.';
            }
        } catch (error) {
            console.error('Error:', error);
            return 'Ha ocurrido un error al actualizar el usuario.';
        }
    }
}






