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
            const newUser = await userModel.create(users)
            return newUser
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
        id_cart,
        documents,
        status,
        last_connection }) {
        try {
            const updatedUser = await userModel.findOneAndUpdate(
                { "_id": id }, {
                $set: {
                    "nombre": nombre,
                    "apellido": apellido,
                    "edad": edad,
                    "rol": rol,
                    "password": password,
                    "id_cart": id_cart,
                    "documents": documents,
                    "status": status,
                    "last_connection": last_connection
                }
            },
                { new: true } // Devuelve el documento actualizado
            );

            if (updatedUser) {
                return `El usuario con ID ${updatedUser._id} se ha actualizado correctamente. Nuevos datos de usuario ${updatedUser}`;
            } else {
                return 'Usuario no encontrado.';
            }
        } catch (error) {
            console.error('Error:', error);
            return 'Ha ocurrido un error al actualizar el usuario.';
        }
    }

    //Método para cargar documentos al usuario

    async addDocument(id) {
        try {
            //Busco el nombre y la ruta del doc
            /* */
            //Pusheo el doc y actualizo el usuario
            const latestSession = await sessionModel.findOne().sort({ $natural: -1 }).exec();
            if (latestSession) {
                const data = JSON.parse(latestSession.session);
                const userDatos = data.user;
                const _id = userDatos._id;
                const userFound = await getUserById(_id)
                /*userFound.documents.push({
            name: 'Nuevo Documento',
            reference: 'Referencia del Nuevo Documento'
            });
            await userManager.updateUser(_id, { documents: userFound.documents });
            */
            }
        }
        catch (error) {
            console.error('Error:', error);
            return 'Ha ocurrido un error de carga';


        }

    }
}