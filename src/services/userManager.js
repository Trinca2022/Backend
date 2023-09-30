import { userModel } from "../persistencia/models/Users.js"
import { logger } from "../utils/logger.js";
//import { SessionManager } from "./sessionManager.js";

//const sessionManager = new SessionManager()

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
                return updatedUser;
            } else {
                return 'Usuario no encontrado.';
            }
        } catch (error) {
            console.error('Error:', error);
            return 'Ha ocurrido un error al actualizar el usuario.';
        }
    }

    async userToPremium(id) {
        try {
            //hecho con req.sess en prod controller
            //  const _id = await sessionManager.findIdSession()

            const userFound = await this.getUserById(id)
            const documents = userFound.documents
            const identificacionDocument = documents.find(doc => doc.name === 'identificacion.pdf');
            const domicilioDocument = documents.find(doc => doc.name === 'domicilio.pdf');
            const estadoCuentaDocument = documents.find(doc => doc.name === 'estadoCuenta.pdf');
            if (!identificacionDocument || !domicilioDocument || !estadoCuentaDocument) {
                const statusUser = userFound.status
                return statusUser
                //console.log(`Faltan cargar documentos`);
            } else {
                const updatedUser = await this.updateUser(id, { status: true });
                const statusUpdatedUser = updatedUser.status
                return statusUpdatedUser
            }
        }
        catch (error) {
            console.error('Error:', error);
            return 'Ha ocurrido un error al actualizar el usuario.';

        }

    }





}