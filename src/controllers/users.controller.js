import { UsersManager } from "../services/usersManager.js";

//Utilizo las funciones creadas en los managers (services), para ejecutar req, res y enviarlo a la ruta
const usersManager = new UsersManager()

//Manejo búsqueda por ID que exporto a la ruta
export const getUsersHandler = async (req, res) => {
    try {
        const isAdmin = req.session.user.rol === "Administrador"
        const users = JSON.parse(JSON.stringify(await usersManager.getUsers())).map((user) => ({
            ...user, inactiveUser: Date.now() >= new Date(user.last_connection).getTime() + (2 * 60 * 60 * 1000)//getTime() + (2 * 24 * 60 * 60 * 1000)
        }))
        res.render('users', { isAdmin, users })
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los usuarios');
    }

}


//Manejo función que elimina un producto y exporto a la ruta
export const deleteUsersHandler = async (req, res, next) => {
    try {
        const users = JSON.parse(JSON.stringify(await usersManager.getUsers()))
        console.log("usersss", users)



    }
    catch (error) {
        next(error)
    }
}