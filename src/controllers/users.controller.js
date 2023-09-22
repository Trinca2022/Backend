import { userModel } from "../persistencia/models/Users.js";
import { UsersManager } from "../services/usersManager.js";

//Utilizo las funciones creadas en los managers (services), para ejecutar req, res y enviarlo a la ruta
const usersManager = new UsersManager()

//Manejo búsqueda por ID que exporto a la ruta
export const getUsersHandler = async (req, res) => {
    try {
        const users = JSON.parse(JSON.stringify(await userModel.find()))
        console.log("hola", users)


        res.render('users', { users })
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los usuarios');
    }

}