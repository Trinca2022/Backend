import { usersMongo } from '../persistencia/DAOs/usersMongo.js'


//Genero una clase UsersManager
export class UsersManager {
    constructor(path) {
        this.path = path
    }

    //


    //Método getUsers--> busca todos los users
    async getUsers() {
        const usersFound = await usersMongo.findAll()
        if (usersFound) {
            return usersFound
        }
        else return "Usuarios no encontrados"
    }
}